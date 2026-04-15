import * as StellarSdk from 'stellar-sdk';
import { Horizon } from 'stellar-sdk';

const PI_TESTNET_SERVER = 'https://api.testnet.minepi.com';
const PI_MAINNET_SERVER = 'https://api.mainnet.minepi.com';
const PI_TESTNET_PASSPHRASE = 'Pi Testnet';
const PI_MAINNET_PASSPHRASE = 'Pi Network';

export class PiBlockchainService {
  private server: Horizon.Server;
  private networkPassphrase: string;
  private secretSeed: string;
  private keypair: StellarSdk.Keypair;

  constructor(secretSeed?: string, network: 'testnet' | 'mainnet' = 'testnet') {
    this.secretSeed = secretSeed || '';
    try {
      const envSecret = (globalThis as any).process?.env?.PI_WALLET_SECRET_SEED;
      if (envSecret) {
        this.secretSeed = envSecret;
      }
    } catch {
      // Ignore if process is not available
    }
    
    const serverUrl = network === 'mainnet' ? PI_MAINNET_SERVER : PI_TESTNET_SERVER;
    this.server = new Horizon.Server(serverUrl);
    this.networkPassphrase = network === 'mainnet' ? PI_MAINNET_PASSPHRASE : PI_TESTNET_PASSPHRASE;
    
    if (this.secretSeed) {
      this.keypair = StellarSdk.Keypair.fromSecret(this.secretSeed);
    } else {
      throw new Error('Secret seed is required for blockchain operations');
    }
  }

  getPublicKey(): string {
    return this.keypair.publicKey();
  }

  // Load account details
  async loadAccount(publicKey?: string): Promise<Horizon.AccountResponse> {
    const key = publicKey || this.keypair.publicKey();
    try {
      const account = await this.server.loadAccount(key);
      return account;
    } catch (error) {
      console.error('Failed to load account:', error);
      throw error;
    }
  }

  // Get account balance
  async getBalance(publicKey?: string): Promise<string> {
    const account = await this.loadAccount(publicKey);
    const balance = account.balances.find((b: any) => b.asset_type === 'native');
    return balance ? balance.balance : '0';
  }

  // Build and submit A2U payment transaction
  async submitA2UPayment(
    recipientAddress: string,
    amount: string,
    paymentIdentifier: string
  ): Promise<string> {
    try {
      // Load sender account
      const account = await this.loadAccount();
      
      // Fetch base fee
      const baseFee = await this.server.fetchBaseFee();
      
      // Fetch timebounds (180 seconds timeout)
      const timebounds = await this.server.fetchTimebounds(180);

      // Create payment operation
      const payment = StellarSdk.Operation.payment({
        destination: recipientAddress,
        asset: StellarSdk.Asset.native(),
        amount: amount,
      });

      // Build transaction
      let transaction = new StellarSdk.TransactionBuilder(account, {
        fee: baseFee.toString(),
        networkPassphrase: this.networkPassphrase,
        timebounds: timebounds,
      })
        .addOperation(payment)
        .addMemo(StellarSdk.Memo.text(paymentIdentifier))
        .setTimeout(180);

      const builtTx = transaction.build();

      // Sign transaction
      builtTx.sign(this.keypair);

      // Submit transaction
      const result = await this.server.submitTransaction(builtTx);
      return result.hash;
    } catch (error) {
      console.error('Failed to submit A2U payment:', error);
      throw error;
    }
  }

  // Check transaction status
  async getTransaction(txid: string): Promise<any> {
    try {
      const transaction = await this.server.transactions().transaction(txid).call();
      return transaction;
    } catch (error) {
      console.error('Failed to get transaction:', error);
      throw error;
    }
  }
}

export const piBlockchain = (secretSeed?: string, network?: 'testnet' | 'mainnet') => 
  new PiBlockchainService(secretSeed, network);
