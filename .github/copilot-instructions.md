# AI Coding Guidelines

## Architecture Overview

Modern React 19 SPA with feature-based architecture:

- `src/app/` — Bootstrap, providers, router setup
- `src/routes/` — File-based routes (thin wiring only)
- `src/pages/` — Page composition (imports from features)
- `src/features/` — Domain modules with colocated api, store, hooks, components
- `src/components/` — Shared UI primitives
- `src/lib/` — env validation, api client, query client
- `src/layout/` — Root layout shell

## Typing (Zod-first)

- Define Zod schemas as the single source of truth
- Infer types: `type Todo = z.infer<typeof todoSchema>`
- Never duplicate types with interfaces
- Validate env in `@lib/env.ts` and API responses in `@lib/api-client.ts`
- Forbidden: `any`, `enum`, type assertions (`as`), non-null assertions (`!`)

## State Management

| Concern           | Tool                                            |
| ----------------- | ----------------------------------------------- |
| Server/async data | TanStack Query in `features/*/api/*.queries.ts` |
| UI/client state   | Zustand in `features/*/store/*.store.ts`        |
| URL state         | TanStack Router search params                   |

- One Zustand store per feature, not a global monolith
- Never store server data in Zustand
- Use query key factories in `*.query-keys.ts`

## Path Aliases

Always use path aliases — never `../` from routes, pages, app, or layout:

```typescript
import { TodosPanel } from '@features/todos'

// correct
import Home from '../../pages/Home'

// wrong
```

Aliases: `@app`, `@features`, `@lib`, `@components`, `@pages`, `@layout`,
`@hooks`, `@utils`, `@shared`, `@/*`

## Feature Structure

```
features/<name>/
  api/          # schemas, api, query-keys, queries
  store/        # Zustand UI state
  components/
  hooks/
  index.ts      # public API
```

## Routing

- TanStack Router file-based routing in `src/routes/`
- Routes export `Route` via `createFileRoute()` — no business logic
- `src/routeTree.gen.ts` is auto-generated — never edit

## React Patterns

- Functional components, hooks for logic
- `useState` for local component state only
- Cross-component UI state → Zustand
- Server data → TanStack Query with `queryOptions()`
- React Compiler enabled in production; ESLint enforces compliance

## Code Style

- No semicolons, single quotes, tabs (Prettier)
- Import order: React → third-party → `@app` → `@lib` → `@features` → aliases →
  relative
- Strict TypeScript + ESLint `strictTypeChecked` with `--max-warnings 0`

## Commands

```bash
pnpm dev          # development
pnpm validate     # tsc + lint + test
pnpm build        # validate + production build
pnpm test         # run tests
pnpm lint:fix     # fix lint issues
```

## Quality Gates

- `pnpm validate` before builds
- Husky pre-commit: typecheck + lint-staged
- Husky pre-push: tests

See also `AGENTS.md` and `.cursor/rules/` for Cursor-specific rules.
