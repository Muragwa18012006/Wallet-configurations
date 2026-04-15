# Pi App

A complete web application integrated with Pi Network, built with Next.js and deployed on Vercel.

## Features

- **Pi Authentication**: Secure user authentication with Pi Network accounts
- **User-to-App (U2A) Payments**: Accept Pi cryptocurrency payments from users
- **App-to-User (A2U) Payments**: Send Pi rewards to users
- **Balance Checking**: View Pi wallet balances
- **Social Sharing**: Share your app with other Pi pioneers

## Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Blockchain**: Stellar SDK for Pi blockchain interactions
- **Deployment**: Vercel

## Project Structure

```
pi-app/
├── src/
│   ├── app/
│   │   ├── api/
│   │   │   ├── payments/
│   │   │   │   ├── approve/route.ts    # Approve U2A payments
│   │   │   │   ├── complete/route.ts   # Complete U2A payments
│   │   │   │   └── a2u/route.ts        # A2U payment endpoint
│   │   │   └── balance/route.ts        # Get wallet balance
│   │   ├── globals.css
│   │   ├── layout.tsx
│   │   └── page.tsx
│   ├── components/
│   │   ├── PiAuth.tsx                  # Authentication component
│   │   ├── PiPayment.tsx               # Payment component
│   │   ├── PiBalance.tsx               # Balance display component
│   │   ├── PiShare.tsx                 # Social sharing component
│   │   └── index.ts
│   ├── lib/
│   │   ├── pi-sdk.ts                   # Pi SDK integration
│   │   ├── pi-api.ts                   # Pi API client
│   │   ├── pi-blockchain.ts            # Blockchain operations
│   │   └── utils.ts                    # Utility functions
│   └── types/
│       ├── pi-sdk.d.ts                 # TypeScript definitions
│       └── index.ts
├── public/
├── .env.example
├── next.config.js
├── package.json
├── tailwind.config.ts
├── tsconfig.json
└── vercel.json
```

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn
- Pi Developer account (register at [minepi.com/developers](https://minepi.com/developers))

### Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/pi-app.git
cd pi-app
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
```bash
cp .env.example .env.local
```

4. Edit `.env.local` with your Pi credentials:
```
PI_API_KEY=your_pi_api_key_here
PI_NETWORK=testnet
PI_WALLET_SECRET_SEED=your_secret_seed_here
PI_WALLET_PUBLIC_KEY=your_public_key_here
```

### Running Locally

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

**Note**: For the best experience, test the app in the Pi Browser.

## Pi Network Integration

### 1. Register Your App

1. Open the Pi Browser on your mobile device
2. Navigate to the Developer Portal
3. Create a new app
4. Get your API key

### 2. Configure Authentication

The `PiAuth` component handles user authentication:

```tsx
import { PiAuth } from '@/components';

<PiAuth 
  onAuthSuccess={(result) => console.log(result.user)}
  onAuthError={(error) => console.error(error)}
/>
```

### 3. Accept Payments (U2A)

The `PiPayment` component handles user-to-app payments:

```tsx
import { PiPayment } from '@/components';

<PiPayment
  amount={1.0}
  memo="Payment for premium feature"
  metadata={{ productId: 'premium' }}
  onPaymentSuccess={(paymentId, txid) => console.log(paymentId, txid)}
/>
```

### 4. Send Rewards (A2U)

Use the API endpoint to send Pi to users:

```typescript
const response = await fetch('/api/payments/a2u', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    amount: 0.5,
    memo: 'Reward for completing task',
    uid: userUid,
  }),
});
```

## Deployment on Vercel

### 1. Push to GitHub

```bash
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/yourusername/pi-app.git
git push -u origin main
```

### 2. Deploy to Vercel

1. Go to [vercel.com](https://vercel.com) and sign in
2. Click "New Project"
3. Import your GitHub repository
4. Configure environment variables in Vercel dashboard:
   - `PI_API_KEY`
   - `PI_NETWORK`
   - `PI_WALLET_SECRET_SEED`
   - `PI_WALLET_PUBLIC_KEY`
5. Deploy!

### 3. Update Pi Developer Portal

After deployment, update your app URL in the Pi Developer Portal.

## Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `PI_API_KEY` | Your Pi API key from Developer Portal | Yes |
| `PI_NETWORK` | Network type: `testnet` or `mainnet` | Yes |
| `PI_WALLET_SECRET_SEED` | Secret seed for A2U payments | For A2U |
| `PI_WALLET_PUBLIC_KEY` | Public key for A2U payments | For A2U |
| `NEXT_PUBLIC_APP_URL` | Your app URL | No |

## API Endpoints

### POST /api/payments/approve
Approve a U2A payment (server-side)

### POST /api/payments/complete
Complete a U2A payment after blockchain confirmation

### POST /api/payments/a2u
Create and process an A2U payment

### GET /api/balance?address={address}
Get Pi balance for an address

## Important Notes

1. **Security**: Never expose your `PI_WALLET_SECRET_SEED` in client-side code
2. **Testing**: Always test on testnet before mainnet
3. **Pi Browser**: Some features only work in the Pi Browser
4. **Server-side**: Payment approvals and A2U payments require server-side processing

## Learn More

- [Pi Network SDK Documentation](https://pi-apps.github.io/pi-sdk-docs/)
- [Pi Developer Portal](https://minepi.com/developers/)
- [Next.js Documentation](https://nextjs.org/docs)
- [Vercel Documentation](https://vercel.com/docs)

## License

MIT License - feel free to use this template for your own Pi apps!
