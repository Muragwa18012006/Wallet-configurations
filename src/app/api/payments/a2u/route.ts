import { NextRequest, NextResponse } from 'next/server';
import { piAPI } from '@/lib/pi-api';
import { piBlockchain } from '@/lib/pi-blockchain';
import { A2UPaymentRequest } from '@/types/pi-sdk';

export async function POST(request: NextRequest) {
  try {
    const body: A2UPaymentRequest = await request.json();
    const { amount, memo, metadata, uid } = body;

    if (!amount || !memo || !uid) {
      return NextResponse.json(
        { error: 'Amount, memo, and user UID are required' },
        { status: 400 }
      );
    }

    // Step 1: Create payment on Pi server
    const payment = await piAPI.createA2UPayment({
      amount,
      memo,
      metadata,
      uid,
    });

    // Step 2: Submit transaction to blockchain
    const blockchain = piBlockchain();
    const txid = await blockchain.submitA2UPayment(
      payment.recipient,
      amount.toString(),
      payment.identifier
    );

    // Step 3: Complete the payment
    const completedPayment = await piAPI.completePayment(payment.identifier, txid);

    return NextResponse.json({
      success: true,
      payment: completedPayment,
      txid,
    });
  } catch (error) {
    console.error('A2U payment error:', error);
    return NextResponse.json(
      { error: 'Failed to process A2U payment' },
      { status: 500 }
    );
  }
}
