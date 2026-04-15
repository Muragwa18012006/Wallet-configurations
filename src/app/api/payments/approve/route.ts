import { NextRequest, NextResponse } from 'next/server';
import { piAPI } from '@/lib/pi-api';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { paymentId } = body;

    if (!paymentId) {
      return NextResponse.json(
        { error: 'Payment ID is required' },
        { status: 400 }
      );
    }

    // Approve the payment using Pi API
    const payment = await piAPI.approvePayment(paymentId);

    return NextResponse.json({ 
      success: true, 
      payment 
    });
  } catch (error) {
    console.error('Payment approval error:', error);
    return NextResponse.json(
      { error: 'Failed to approve payment' },
      { status: 500 }
    );
  }
}
