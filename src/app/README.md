# App Router Guide

This directory is the App Router entry layer only.

Goals:
- Keep `src/app` focused on routing and framework entry files.
- Keep page UI implementation inside `src/ui/app`.
- Keep route files simple, predictable, and easy to search.

## Directory Layout

```text
src/app/
  (home)/                 # Route group entries
  examples/               # Route entries for examples
  api/                    # Route handlers
  layout.tsx              # Root layout entry
  error.tsx               # Error boundary entry
  not-found.tsx           # Not-found entry
```

## Responsibilities

### `src/app/*`
- Define route entry points (`page.tsx`, `layout.tsx`, route handlers).
- Keep route files minimal and declarative.
- Prefer wiring imports and composition only.

### `src/ui/app/*`
- Implement page UI and interactions.
- Own most styles, layout details, and view logic.
- Mirror route structure from `src/app` for fast lookup.

## API Route Testing

API route handlers are tested as functions and do not require page rendering:

```text
src/app/api/time/
  route.ts
  test/
    route.test.ts
```

Cover successful responses, known `BaseError` responses, and unexpected error responses through the
handler's public response contract. Keep route tests focused on handler behavior and leave shared
serialization details to tests for `src/lib/http/next.ts`.

## Checklist For PRs

- New route has both `src/app/**` entry and `src/ui/app/**` UI file.
- Route entry exports `default function Page()` or `default function Layout()`.
- Route entry returns a route-named UI component.
- Non-static page styles are not added in `src/app/**`.
- Imports use mirrored path under `@/ui/app/...` when applicable.
- API route tests are colocated under the matching route directory's `test/` folder.
