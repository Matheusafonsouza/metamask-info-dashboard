This is a Next.js web app that connects to MetaMask and displays wallet info.

## Features

- Connect and disconnect MetaMask
- Sign In with Ethereum (SIWE) using wallet signature
- Show connected wallet address
- Show active network name and chain ID
- Show native token balance for the connected account
- Show ERC-20 tokens for the connected wallet (Ethereum Mainnet)
- Handle common error states (wallet missing, rejected connection, unsupported network)

## Getting Started

Install dependencies and run the development server:

```bash
npm install

# copy env template and fill values
cp .env.example .env.local

npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Requirements

- MetaMask browser extension installed
- A wallet account in MetaMask
- Ethereum Mainnet selected for supported behavior
- `ALCHEMY_API_KEY` in `.env.local` for token balance lookup
- `SIWE_SESSION_SECRET` in `.env.local` for secure SIWE session cookies
- `NEXT_PUBLIC_ETH_MAINNET_ENDPOINT` in `.env.local` for reliable client balance reads

## Troubleshooting

- If native balance fails with transport errors (for example `eth_call` fetch errors), set a stable public RPC in `.env.local`:

```bash
NEXT_PUBLIC_ETH_MAINNET_ENDPOINT=https://ethereum.publicnode.com
```

`NEXT_PUBLIC_MAINNET_RPC_URL` is still supported as a fallback for backward compatibility.

- Restart `npm run dev` after changing environment variables.

## Tech Stack

- Next.js (App Router) + TypeScript
- Tailwind CSS
- wagmi + viem
- @tanstack/react-query

## Project Structure

- `src/lib/web3/config.ts`: wagmi/chain/connectors setup
- `src/lib/api/`: client-side backend request helpers (auth/tokens)
- `src/lib/siwe/`: SIWE nonce/session/config helpers
- `src/components/Web3Provider.tsx`: app-level web3 providers
- `src/components/WalletPanel.tsx`: connect/disconnect + wallet info UI
- `src/hooks/useSiweAuth.ts`: SIWE sign-in/sign-out client flow
- `src/app/api/auth/*`: SIWE nonce/verify/session/logout endpoints
- `src/app/page.tsx`: page shell for wallet dashboard

## Next Steps

- Add transaction actions (send ETH / token transfer)
- Add support for more networks

