This is a Next.js web app that connects to MetaMask and displays wallet info.

## Features

- Connect and disconnect MetaMask
- Show connected wallet address
- Show active network name and chain ID
- Show native token balance for the connected account
- Show ERC-20 tokens for the connected wallet (Ethereum Mainnet)
- Handle common error states (wallet missing, rejected connection, unsupported network)

## Getting Started

Install dependencies and run the development server:

```bash
npm install

# add your Alchemy key in .env.local
# ALCHEMY_API_KEY=your_key_here

npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Requirements

- MetaMask browser extension installed
- A wallet account in MetaMask
- Ethereum Mainnet selected for supported behavior
- `ALCHEMY_API_KEY` in `.env.local` for token balance lookup

## Tech Stack

- Next.js (App Router) + TypeScript
- Tailwind CSS
- wagmi + viem
- @tanstack/react-query

## Project Structure

- `src/lib/web3/config.ts`: wagmi/chain/connectors setup
- `src/components/Web3Provider.tsx`: app-level web3 providers
- `src/components/WalletPanel.tsx`: connect/disconnect + wallet info UI
- `src/app/page.tsx`: page shell for wallet dashboard

## Next Steps

- Add Sign-In with Ethereum (SIWE) for authentication
- Add transaction actions (send ETH / token transfer)
- Add support for more networks

