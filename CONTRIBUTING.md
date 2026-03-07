# Contributing

Thanks for contributing to MetaMask Landing.

## Prerequisites

- Node.js 20+
- npm 10+
- MetaMask browser extension
- Valid `.env.local` based on `.env.example`

## Local setup

```bash
npm install
cp .env.example .env.local
npm run dev
```

## Development workflow

1. Create a feature branch from your main branch.
2. Keep changes focused and small.
3. Run lint/build before opening a PR.
4. Include screenshots or short clips for UI changes.

## Code guidelines

- Use TypeScript strict-friendly patterns.
- Prefer small reusable functions over duplicated logic.
- Keep React components focused on rendering and orchestration.
- Move HTTP request logic to `src/lib/api/*` instead of writing raw `fetch` in components.
- Use hooks for stateful behavior (`src/hooks/*`).
- Use wallet context (`src/components/wallet/WalletContext.tsx`) to avoid prop drilling.
- Avoid nested ternary chains in UI code.
- Keep comments brief and only where intent is not obvious.

## Styling guidelines

- Use Tailwind utilities.
- Keep responsive behavior in mind for all UI changes.
- Reuse visual patterns already present in wallet components when possible.

## API and auth conventions

- Keep SIWE route behavior aligned with `src/lib/siwe/*`.
- Validate inputs in API routes and return clear error messages.
- Do not expose secrets in client code.
- Keep SIWE cookie handling server-side only.

## Validation before PR

Run these commands and ensure both pass:

```bash
npm run lint
npm run build
```

## Pull request checklist

- [ ] Feature/fix is scoped and explained clearly.
- [ ] Lint and build pass locally.
- [ ] Environment variables changes are documented in `README.md` and `.env.example`.
- [ ] API contract changes are reflected in README endpoint docs.
- [ ] UI changes include updated screenshots when relevant.

## Commit message suggestion

Use clear, action-oriented commit messages, for example:

- `feat(wallet): add SIWE session refresh guard`
- `refactor(api): move token fetch logic to client api layer`
- `fix(auth): prevent auto sign-in after manual sign-out`
