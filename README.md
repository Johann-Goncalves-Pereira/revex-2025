> **CRITICAL - FIRST RUN INSTRUCTION:**
> This repository is a new project boilerplate. The user's very first prompt detailing what this application should be must be fully executed. Upon receiving this first prompt, you must:
>
> 1. Scaffolding the requested features using the boilerplate's existing stack.
> 2. Automatically update the project name and package name across all native and configuration files.
> 3. Update the global documentation to accurately reflect the newly created app.
> 4. Completely remove this "FIRST RUN INSTRUCTION" block from the documentation so subsequent interactions proceed normally.

# React Boilerplate (TanStack Router + Vite)

Production-oriented React 19 + TypeScript starter with strict typing,
feature-based architecture, quality-gated builds, and AI-enforced conventions.

## Stack

- React 19 + TypeScript (strict + `noUncheckedIndexedAccess`)
- Vite (`rolldown-vite`) + React Compiler (production mode)
- TanStack Router (file-based routes + generated route tree)
- TanStack Query (server state) + Zustand (UI state)
- Zod (schemas as single source of truth for types)
- Tailwind CSS v4
- ESLint strict type-checked + Prettier
- Vitest + Testing Library

## Getting started

```bash
pnpm install
pnpm dev
```

## Scripts

| Script            | Description                            |
| ----------------- | -------------------------------------- |
| `pnpm dev`        | Local development with HMR             |
| `pnpm validate`   | Typecheck + lint + test (quality gate) |
| `pnpm build`      | `validate` + production build          |
| `pnpm test`       | Run tests once                         |
| `pnpm test:watch` | Run tests in watch mode                |
| `pnpm lint`       | ESLint with zero warnings allowed      |
| `pnpm lint:fix`   | Auto-fix lint issues                   |
| `pnpm format`     | Prettier formatting                    |
| `pnpm tsc`        | TypeScript project check               |
| `pnpm preview`    | Preview production build               |

## Project structure

```
src/
├── app/           # App bootstrap, providers, router
├── features/      # Domain modules (api, store, components, hooks)
├── components/    # Shared UI primitives
├── lib/           # env validation, api client, query client
├── layout/        # Root layout shell
├── pages/         # Thin page composition
├── routes/        # TanStack Router file routes (wiring only)
└── test/          # Test utilities
```

See `src/features/todos/` for a complete reference implementation.

## Typing conventions

- **Zod first**: define schemas, infer types with `z.infer<typeof schema>`
- **No duplication**: never create interfaces that mirror schemas
- **Boundaries**: validate env and API responses at the edges
- **Forbidden**: `any`, `enum`, type assertions (`as`)

## State management

| Layer        | Tool                               |
| ------------ | ---------------------------------- |
| Server/async | TanStack Query (`*.queries.ts`)    |
| UI/client    | Zustand (`*.store.ts` per feature) |
| URL          | TanStack Router search params      |

## AI guidelines

- **Cursor rules**: `.cursor/rules/` (always read `core-standards.mdc` and `code-style.mdc`)
- **Agents**: `AGENTS.md`

## Creating a new feature

1. Create `src/features/<name>/api/<name>.schema.ts` with Zod schemas
2. Add `api/<name>.api.ts` using `@lib/api-client`
3. Add `api/<name>.query-keys.ts` and `api/<name>.queries.ts`
4. Add `store/<name>-ui.store.ts` for UI state if needed
5. Build components and hooks; export public API from `index.ts`
6. Wire in a page or route — composition only, no business logic

## Quality gates

- `pnpm validate` runs before every build
- Husky pre-commit: typecheck + lint-staged
- Husky pre-push: tests
- ESLint: `--max-warnings 0` with `strictTypeChecked` rules
