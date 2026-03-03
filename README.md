# React Boilerplate (TanStack Router + Vite)

Production-oriented React 19 + TypeScript starter with strict linting, route
generation, and quality-gated builds.

## Stack

- React 19 + TypeScript
- Vite (`rolldown-vite`) + React Compiler (production mode)
- TanStack Router (file-based routes + generated route tree)
- TanStack Query (with Devtools)
- Tailwind CSS v4
- ESLint + Prettier (import sorting + Tailwind class sorting)

## Getting started

```bash
pnpm install
pnpm dev
```

## Scripts

- `pnpm dev` - local development
- `pnpm dev:compiler` - dev server in production mode
- `pnpm dev:compiler-test` - production NODE_ENV compiler check
- `pnpm tsc` - TypeScript project reference check
- `pnpm lint` - ESLint checks
- `pnpm format` - Prettier formatting
- `pnpm build` - format + typecheck + lint + production build
- `pnpm build:vercel` - deployment build command
- `pnpm preview` - preview built output

## Best-practice defaults included

- Strict TypeScript and stricter React/TS ESLint rules
- Local Prettier resolution in VS Code (`prettier.preferLocal`)
- Router plugin enabled in Vite for route generation and code splitting
- Default not-found UI wired at router level
- `vercel.json` configured for SPA rewrites and static asset caching
