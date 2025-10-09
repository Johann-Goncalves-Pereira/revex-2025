# AI Coding Guidelines

## Architecture Overview

This is a modern React 19 application using TanStack Router for file-based routing. The app structure follows:

- `src/routes/` - File-based routes (e.g., `index.tsx` for `/`, `__root.tsx` for layout)
- `src/pages/` - Page components referenced by routes
- `src/components/` - Reusable components
- `src/layout/` - Layout components (e.g., `Root.tsx` wraps all routes)

## Key Patterns & Conventions

### Routing

- Use TanStack Router's file-based routing: create route files in `src/routes/` following the file path structure
- Routes export a `Route` object created with `createFileRoute(path)` or `createRootRoute()`
- The root route (`__root.tsx`) defines the layout component that wraps all pages
- Route tree is auto-generated in `src/routeTree.gen.ts` - never edit this file

### Path Aliases

Always use path aliases for imports:

```typescript
import Home from "@pages/Home"; // ✅ Correct
import Home from "../../pages/Home"; // ❌ Avoid relative paths
```

Available aliases:

- `@components/*` - Reusable components
- `@layout/*` - Layout components
- `@pages/*` - Page components
- `@hooks/*` - Custom hooks
- `@utils/*` - Utility functions
- `@shared/*` - Shared resources
- `@/*` - Root src directory

### React Compiler

- React Compiler is enabled in production builds only (keeps HMR working in development)
- Follow React Compiler rules: avoid unsupported patterns that break optimization
- ESLint will enforce React Compiler compliance

### Styling

- Use Tailwind CSS v4 with utility classes
- Prettier automatically sorts Tailwind classes
- Follow the concentric-css ordering defined in prettier config

### Code Style

- **No semicolons** (`semi: false`)
- **Single quotes** for strings (`singleQuote: true`)
- **Tabs** for indentation (`useTabs: true`)
- **Import sorting**: React → Third-party → Aliases (@/) → Relative imports
- **Strict TypeScript**: No unused variables/parameters allowed

## Development Workflows

### Building & Running

```bash
pnpm dev              # Development with HMR (no React Compiler)
pnpm dev:compiler     # Development with React Compiler enabled
pnpm build           # Production build (TypeScript + Vite)
pnpm preview         # Preview production build
```

### Code Quality

```bash
pnpm lint            # ESLint with React-specific rules
pnpm format          # Prettier with import sorting + Tailwind
pnpm generate-types  # Generate translation types (if applicable)
```

### React Scan Integration

- Automatically enabled in development for debugging unnecessary re-renders
- Tracks component performance and optimization opportunities
- View results in browser dev tools

## Component Patterns

### Route Components

```typescript
// src/routes/example.tsx
import { createFileRoute } from "@tanstack/react-router";
import ExamplePage from "@pages/Example";

export const Route = createFileRoute("/example")({
  component: ExamplePage,
});
```

### Page Components

```typescript
// src/pages/Example.tsx
function ExamplePage() {
  return <div className='p-4'>Content</div>;
}

export default ExamplePage;
```

### Layout Components

```typescript
// src/layout/Root.tsx
import { Outlet } from "@tanstack/react-router";

function RootLayout() {
  return (
    <>
      <Outlet /> {/* Renders child routes */}
      {/* Other layout elements */}
    </>
  );
}
```

## TypeScript Configuration

- Strict mode enabled with comprehensive linting
- Path aliases configured in both `tsconfig.app.json` and Vite
- Separate configs for app code (`tsconfig.app.json`) and build tools (`tsconfig.node.json`)

## Performance Considerations

- React Compiler optimizes production builds
- React Scan helps identify performance issues in development
- Vite's fast refresh works alongside React Compiler (disabled in dev to preserve HMR)
