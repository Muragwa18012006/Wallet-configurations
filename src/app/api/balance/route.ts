import { NextRequest, NextResponse } from 'next/server';
import { piBlockchain } from '@/lib/pi-blockchain';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const address = searchParams.get('address');

    const blockchain = piBlockchain();
    const balance = await blockchain.getBalance(address || undefined);

    return NextResponse.json({
      success: true,
      balance,
      address: address || blockchain.getPublicKey(),
    });
  } catch (error) {
    console.error('Balance fetch error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch balance' },
      { status: 500 }
    );
  }
}
