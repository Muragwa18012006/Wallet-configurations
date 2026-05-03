
import { NextRequest, NextResponse } from 'next/server';
import { piBlockchain } from '@/lib/pi-blockchain';

export const dynamic = 'force-dynamic';
export const runtime = "nodejs";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const address = searchParams.get('address');

    const secretSeed = process.env.PI_WALLET_SECRET_SEED;
    if (!secretSeed) {
  return NextResponse.json(
    { error: 'PI_WALLET_SECRET_SEED environment variable is required' },
    { status: 500 }
  );
}
    const blockchain = piBlockchain(secretSeed);

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