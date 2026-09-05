---
name: app-router-conventions
description: Use when creating or modifying src/app route entries, page/layout wrappers, framework boundary files, src/app/api/** route handlers, and app-to-ui route mapping.
---

# App Router Conventions

## Scope

Applies to `src/app/**`, including page route entries and `src/app/api/**/route.ts` handlers.

The base template includes the home route and framework boundary files, but no API endpoints or
example pages. Add route directories only when a feature needs them.

## Page Route Rules

1. Keep `src/app` as a thin route-entry layer.
2. Avoid page UI implementation details in route files.
3. For non-static pages, do not write page-specific styles in `src/app`.
4. Route entries export only `default function Page()` or `default function Layout()`.
5. Route entries return named components imported from mirrored `src/ui/app` paths.

Example:

```tsx
import { HomePage } from '@/ui/app/(home)/index'

export default function Page() {
  return <HomePage />
}
```

## Folder Mapping Rule

Keep route path and UI path aligned:

```text
src/app/(home)/page.tsx
src/ui/app/(home)/index.tsx
```

## Route Handler Rules

Applies to `src/app/api/**/route.ts`.

1. Route handlers must use `withResponse` from `@/lib/http/next`.
2. Do not return `NextResponse.json` directly from feature route handlers.
3. Do not add local `try`/`catch` blocks in feature route handlers.
4. Do not hide handler errors with alternate success values.
5. Server-only config must be read through `@/configs/server-env`.
6. Do not put page UI, React hooks, or client component logic in route handlers.
7. Do not call local `src/api` request functions from route handlers to reach the same app.
8. Never return private configuration or secrets to clients.

Prefer a small handler body:

```ts
import { withResponse } from '@/lib/http/next'

export const GET = withResponse(() => {
  return {
    ok: true,
  }
})
```

Add `export const runtime = 'edge'` only when the endpoint is compatible with and benefits from the Edge runtime.

## Route Handler Testing

- Use Vitest to test handlers as functions, without starting a server or rendering pages.
- Place tests at `src/app/api/<domain>/<resource>/test/route.test.ts` beside the handler.
- Import the concrete handler and mock its external dependencies, not the handler itself.
- Assert HTTP status and response body for success and relevant error cases, including known
  `BaseError` and unexpected failures.
- Keep shared serialization tests in `src/lib/http/test/next.test.ts`; route tests focus on the
  endpoint's own behavior.

## Workflow

1. Add route entry in `src/app/<route>/page.tsx` or `layout.tsx`.
2. Add/update mirrored UI in `src/ui/app/<route>/index.tsx`.
3. Keep route entry minimal: import + return.
4. Keep shared layout pieces in `src/ui/app/layout` or route-local `layout/`.
5. For API endpoints, add route handlers under `src/app/api/<domain>/<resource>/route.ts`.

## Review Checklist

- Route file uses `Page`/`Layout` export naming.
- Route file returns route-named UI component from `@/ui/app/...`.
- Non-static styles are not introduced in `src/app/**`.
- API handlers are wrapped with `withResponse`.
- Server secrets stay behind `server-env`.
- `src/app` <-> `src/ui/app` mapping remains one-to-one.
