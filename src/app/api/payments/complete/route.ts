import { NextRequest, NextResponse } from 'next/server';
import { piAPI } from '@/lib/pi-api';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { paymentId, txid } = body;

    if (!paymentId || !txid) {
      return NextResponse.json(
        { error: 'Payment ID and transaction ID are required' },
        { status: 400 }
      );
    }

    // Complete the payment using Pi API
    const payment = await piAPI.completePayment(paymentId, txid);

    return NextResponse.json({ 
      success: true, 
      payment 
    });
  } catch (error) {
    console.error('Payment completion error:', error);
    return NextResponse.json(
      { error: 'Failed to complete payment' },
      { status: 500 }
    );
  }
}
