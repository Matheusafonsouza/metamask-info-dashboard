# MetaMask Landing

MetaMask Landing is a Next.js + TypeScript app that connects to MetaMask, shows live wallet data, fetches ERC-20 balances, and supports Sign In with Ethereum (SIWE).

## Why this project exists

This app is a practical Web3 starter focused on a clear user flow:

1. Connect wallet.
2. Read account and chain data.
3. Authenticate with SIWE.
4. Fetch token balances from backend APIs.

It is designed to be small enough to understand quickly, while still covering real-world concerns like hydration safety, session cookies, and error handling.

## Features

- MetaMask connect/disconnect with pending-request handling.
- Live wallet summary:
	- checksummed address
	- network name and chain ID
	- native balance
- ERC-20 token list for Ethereum Mainnet wallets.
- SIWE authentication flow:
	- nonce generation
	- wallet signature verification
	- signed HTTP-only session cookie
	- logout endpoint
- Client-side API layer (`src/lib/api`) to keep hooks focused on state orchestration instead of raw `fetch` logic.
- Wallet context provider (`src/components/wallet/WalletContext.tsx`) to avoid prop-drilling across wallet UI components.

## Tech stack

- Next.js 16 (App Router)
- TypeScript
- React 19
- wagmi + viem
- SIWE (`siwe` package)
- @tanstack/react-query
- Tailwind CSS v4

## Architecture

### High-level layers

- Presentation layer:
	- `src/components/*`
	- `src/components/wallet/*`
- Orchestration layer (hooks):
	- `src/hooks/useWalletConnection.ts`
	- `src/hooks/useWalletTokens.ts`
	- `src/hooks/useSiweAuth.ts`
- Client API layer:
	- `src/lib/api/http.ts`
	- `src/lib/api/auth.ts`
	- `src/lib/api/tokens.ts`
- Server API routes:
	- `src/app/api/auth/*`
	- `src/app/api/tokens/route.ts`
- Domain helpers/config:
	- `src/lib/web3/config.ts`
	- `src/lib/siwe/*`
	- `src/lib/wallet/*`

### Request/data flow

```mermaid
flowchart TD
	UI[Wallet UI Components] --> Ctx[WalletContext]
	Ctx --> Hooks[Wallet Hooks]
	Hooks --> ClientApi[src/lib/api/*]
	ClientApi --> Routes[/app/api routes]
	Routes --> Ext[Alchemy RPC / SIWE verify]
	Hooks --> Wagmi[wagmi + MetaMask]
```

### SIWE flow

1. Client requests nonce from `GET /api/auth/nonce`.
2. Client builds SIWE message and asks wallet to sign.
3. Client posts `{ message, signature }` to `POST /api/auth/verify`.
4. Server validates domain, URI, chain, and nonce, then verifies signature.
5. Server issues signed session cookie.
6. Client checks `GET /api/auth/session` for current auth state.
7. Logout calls `POST /api/auth/logout` to clear cookie.

## Project structure

```text
src/
	app/
		api/
			auth/
				nonce/route.ts
				verify/route.ts
				session/route.ts
				logout/route.ts
			tokens/route.ts
	components/
		ConnectionHeader.tsx
		WalletPanel.tsx
		Web3Provider.tsx
		wallet/
			WalletActions.tsx
			WalletContext.tsx
			WalletSummary.tsx
			WalletTokenList.tsx
	hooks/
		useWalletConnection.ts
		useWalletTokens.ts
		useSiweAuth.ts
	lib/
		api/
			http.ts
			auth.ts
			tokens.ts
		siwe/
			config.ts
			nonce-store.ts
			session.ts
		wallet/
			format.ts
			view-state.ts
		web3/
			config.ts
	types/
		auth.ts
		wallet.ts
```

## Getting started

### 1. Install dependencies

```bash
npm install
```

### 2. Configure environment

```bash
cp .env.example .env.local
```

Fill the required values in `.env.local`.

### 3. Run development server

```bash
npm run dev
```

Open `http://localhost:3000`.

## Environment variables

| Variable | Required | Purpose |
| --- | --- | --- |
| `ALCHEMY_API_KEY` | Yes | Used by `/api/tokens` to query token balances and metadata. |
| `SIWE_SESSION_SECRET` | Yes | Secret used to sign SIWE session cookies. |
| `NEXT_PUBLIC_ETH_MAINNET_ENDPOINT` | Recommended | Client-side mainnet RPC URL used by wagmi transport. |
| `NEXT_PUBLIC_MAINNET_RPC_URL` | Optional | Backward-compatible fallback if `NEXT_PUBLIC_ETH_MAINNET_ENDPOINT` is not set. |
| `SIWE_DOMAIN` | Optional | Override expected SIWE domain. |
| `SIWE_URI` | Optional | Override expected SIWE URI. |
| `SIWE_NONCE_TTL_SECONDS` | Optional | Nonce expiration window (default: `600`). |
| `SIWE_SESSION_MAX_AGE_SECONDS` | Optional | Session cookie lifetime (default: `86400`). |

## NPM scripts

- `npm run dev`: start development server.
- `npm run build`: production build.
- `npm run start`: run production server.
- `npm run lint`: run ESLint.

## API endpoints

### Auth

- `GET /api/auth/nonce`
	- Returns: `{ nonce }`
- `POST /api/auth/verify`
	- Body: `{ message: string, signature: string }`
	- Returns: `{ authenticated: true, session: { address, chainId } }` on success.
- `GET /api/auth/session`
	- Returns authenticated state and session when present.
- `POST /api/auth/logout`
	- Clears SIWE session cookie.

### Tokens

- `GET /api/tokens?address=<wallet_address>`
	- Validates address.
	- Calls Alchemy `alchemy_getTokenBalances` and `alchemy_getTokenMetadata`.
	- Returns formatted token list.

## UX behavior notes

- Wallet actions and wallet data are shared through context to avoid prop drilling.
- App is hydration-safe for wallet-dependent UI.
- SIWE auto-sign-in is gated to avoid accidental re-auth loops after manual sign-out/disconnect.
- Token panel is mainnet-aware and displays loading/error/empty states.

## Troubleshooting

### Native balance transport errors

Set a stable RPC endpoint in `.env.local`:

```bash
NEXT_PUBLIC_ETH_MAINNET_ENDPOINT=https://ethereum.publicnode.com
```

Then restart dev server.

### MetaMask not detected

- Install MetaMask extension.
- Reload browser tab.
- Confirm extension is enabled for the current browser profile.

### Token list is empty

- Confirm wallet is connected to Ethereum Mainnet.
- Confirm `ALCHEMY_API_KEY` is valid.
- Confirm wallet actually has ERC-20 balances.

## Security and production notes

- Session cookie is signed (HMAC), HTTP-only, same-site lax, and secure in production.
- Nonces are currently stored in memory (`nonce-store.ts`). For multi-instance deployments, move nonce storage to Redis or another shared store.
- Keep `SIWE_SESSION_SECRET` strong and private.

## Future improvements

- Add integration tests for connect/sign-in/sign-out/disconnect flows.
- Introduce shared persistent store for SIWE nonces.
- Add multi-chain support and chain switching UX.
- Add transaction features (send native token / ERC-20 transfer).

