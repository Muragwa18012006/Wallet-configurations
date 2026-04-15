import axios, { AxiosInstance } from 'axios';
import { A2UPaymentRequest, A2UPaymentResponse, PaymentDTO } from '@/types/pi-sdk';

const PI_API_BASE_URL = 'https://api.minepi.com';

export class PiAPIService {
  private client: AxiosInstance;
  private apiKey: string;

  constructor(apiKey?: string) {
    this.apiKey = apiKey || '';
    try {
      const envApiKey = (globalThis as any).process?.env?.PI_API_KEY;
      if (envApiKey) {
        this.apiKey = envApiKey;
      }
    } catch {
      // Ignore if process is not available
    }
    
    this.client = axios.create({
      baseURL: PI_API_BASE_URL,
      timeout: 20000,
      headers: {
        'Authorization': `Key ${this.apiKey}`,
        'Content-Type': 'application/json',
      },
    });
  }

  // Get current user info
  async getMe(): Promise<any> {
    try {
      const response = await this.client.get('/v2/me');
      return response.data;
    } catch (error) {
      console.error('Failed to get user info:', error);
      throw error;
    }
  }

  // Approve a payment (server-side approval for U2A payments)
  async approvePayment(paymentId: string): Promise<PaymentDTO> {
    try {
      const response = await this.client.post(`/v2/payments/${paymentId}/approve`);
      return response.data;
    } catch (error) {
      console.error('Failed to approve payment:', error);
      throw error;
    }
  }

  // Complete a payment (server-side completion)
  async completePayment(paymentId: string, txid: string): Promise<PaymentDTO> {
    try {
      const response = await this.client.post(`/v2/payments/${paymentId}/complete`, { txid });
      return response.data;
    } catch (error) {
      console.error('Failed to complete payment:', error);
      throw error;
    }
  }

  // Cancel a payment
  async cancelPayment(paymentId: string): Promise<PaymentDTO> {
    try {
      const response = await this.client.post(`/v2/payments/${paymentId}/cancel`);
      return response.data;
    } catch (error) {
      console.error('Failed to cancel payment:', error);
      throw error;
    }
  }

  // Create A2U payment (App-to-User payment)
  async createA2UPayment(paymentData: A2UPaymentRequest): Promise<A2UPaymentResponse> {
    try {
      const response = await this.client.post('/v2/payments', paymentData);
      return response.data;
    } catch (error) {
      console.error('Failed to create A2U payment:', error);
      throw error;
    }
  }

  // Get incomplete payments
  async getIncompletePayments(): Promise<PaymentDTO[]> {
    try {
      const response = await this.client.get('/v2/payments/incomplete');
      return response.data.payments;
    } catch (error) {
      console.error('Failed to get incomplete payments:', error);
      throw error;
    }
  }

  // Verify rewarded ad
  async verifyRewardedAd(adId: string): Promise<any> {
    try {
      const response = await this.client.post('/v2/ads/rewarded', { ad_id: adId });
      return response.data;
    } catch (error) {
      console.error('Failed to verify rewarded ad:', error);
      throw error;
    }
  }
}

export const piAPI = new PiAPIService();
