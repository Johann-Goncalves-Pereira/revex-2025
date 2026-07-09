> **CRITICAL - FIRST RUN INSTRUCTION:**
> This repository is a new project boilerplate. The user's very first prompt detailing what this application should be must be fully executed. Upon receiving this first prompt, you must:
>
> 1. Scaffolding the requested features using the boilerplate's existing stack.
> 2. Automatically update the project name and package name across all native and configuration files.
> 3. Update the global documentation to accurately reflect the newly created app.
> 4. Completely remove this "FIRST RUN INSTRUCTION" block from the documentation so subsequent interactions proceed normally.

# AGENTS.md

Guia para agentes de AI trabalhando neste repositório.

## Stack

- React 19 + TypeScript (strict)
- Vite (`rolldown-vite`) + React Compiler (production)
- TanStack Router + TanStack Query
- Zustand (estado de UI)
- Zod (schemas e tipos inferidos)
- Tailwind CSS v4
- Vitest + Testing Library

## Comandos

```bash
pnpm dev        # desenvolvimento
pnpm validate   # tsc + lint + test (gate de qualidade)
pnpm build      # validate + build de produção
pnpm test       # testes
pnpm lint:fix   # corrigir lint
```

## Regras obrigatórias

Leia `.cursor/rules/` — especialmente `core-standards.mdc` e `code-style.mdc` (sempre ativas).

### Nunca faça

- `any`, `enum`, type assertions (`as`), non-null assertion (`!`)
- Duplicar tipos que já existem em schemas Zod
- Lógica de negócio em `routes/` ou `pages/`
- Imports relativos `../` em routes, pages, app, layout
- Estado de servidor no Zustand (use TanStack Query)
- Ignorar erros de ESLint ou TypeScript

### Sempre faça

- Schema Zod primeiro → `type X = z.infer<typeof xSchema>`
- Validar env (`@lib/env`) e API (`@lib/api-client`) nas fronteiras
- Colocar features em `src/features/<nome>/` com `index.ts` como API pública
- Query keys factory em `*.query-keys.ts`
- `queryOptions()` em `*.queries.ts`
- Zustand por feature para estado de UI
- Rodar `pnpm validate` após mudanças

## Criar uma nova feature

1. `src/features/<nome>/api/<nome>.schema.ts` — schemas Zod
2. `api/<nome>.api.ts` — chamadas HTTP com parse
3. `api/<nome>.query-keys.ts` + `api/<nome>.queries.ts`
4. `store/<nome>-ui.store.ts` se houver estado de UI
5. `components/`, `hooks/`, `index.ts`
6. Conectar em `pages/` ou rota — apenas composição

## Estrutura

```
src/
  app/         # bootstrap, providers, router
  features/    # domínio (api, store, components, hooks)
  components/  # UI compartilhada
  lib/         # env, api-client, query-client
  layout/      # shell visual
  pages/       # composição fina
  routes/      # wiring TanStack Router
```
