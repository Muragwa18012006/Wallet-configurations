'use client';

import { PiInitConfig, Scope, AuthResult, PaymentData, PaymentCallbacks } from '@/types/pi-sdk';

const PI_SDK_VERSION = '2.0';

export class PiSDKService {
  private static instance: PiSDKService;
  private initialized = false;
  private sandbox: boolean;

  private constructor() {
    this.sandbox = typeof window !== 'undefined' && 
      (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1');
  }

  static getInstance(): PiSDKService {
    if (!PiSDKService.instance) {
      PiSDKService.instance = new PiSDKService();
    }
    return PiSDKService.instance;
  }

  async init(): Promise<void> {
    if (this.initialized) return;

    // Load Pi SDK script
    await this.loadSDK();

    const config: PiInitConfig = {
      version: PI_SDK_VERSION,
      sandbox: this.sandbox,
    };

    try {
      await window.Pi.init(config);
      this.initialized = true;
      console.log('Pi SDK initialized successfully');
    } catch (error) {
      console.error('Pi SDK initialization failed:', error);
      throw error;
    }
  }

  private loadSDK(): Promise<void> {
    return new Promise((resolve, reject) => {
      if (document.getElementById('pi-sdk-script')) {
        resolve();
        return;
      }

      const script = document.createElement('script');
      script.id = 'pi-sdk-script';
      script.src = 'https://sdk.minepi.com/pi-sdk.js';
      script.async = true;
      script.onload = () => resolve();
      script.onerror = () => reject(new Error('Failed to load Pi SDK'));
      document.head.appendChild(script);
    });
  }

  async authenticate(scopes: Scope[] = ['username']): Promise<AuthResult> {
    await this.init();
    
    try {
      const result = await window.Pi.authenticate(scopes, this.onIncompletePaymentFound);
      return result;
    } catch (error) {
      console.error('Authentication failed:', error);
      throw error;
    }
  }

  createPayment(paymentData: PaymentData, callbacks: PaymentCallbacks): void {
    if (!this.initialized) {
      throw new Error('Pi SDK not initialized. Call init() first.');
    }

    window.Pi.createPayment(paymentData, callbacks);
  }

  private onIncompletePaymentFound(payment: any): void {
    console.log('Incomplete payment found:', payment);
    // Handle incomplete payment - typically complete it or cancel it
  }

  isInitialized(): boolean {
    return this.initialized;
  }
}

export const piSDK = PiSDKService.getInstance();
