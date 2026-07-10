# Lib Guide

This directory contains the project's lowest-level infrastructure modules.

Goals:
- Centralize shared infrastructure primitives like error handling and HTTP wrappers.
- Keep cross-cutting behavior consistent across UI, hooks, and API layers.
- Keep this layer stable and hard to change by default.

## Directory Layout

```text
src/lib/
  common/
    errors/                # Base error model and request errors
  http/                    # HTTP, Next route response, React Query client wrappers
  runtime/                 # Global runtime initializers
  utils/                   # Pure utility helpers
```

## Modification Policy

By default, only `utils/` should be modified in normal feature work.

Do not modify `src/lib/utils/shadcn/**`; treat it as shadcn support code.

For other directories (`common/`, `http/`, `runtime/`):
- Treat them as foundational infrastructure.
- Do not modify unless there is a clear new business requirement that must change global behavior.
- Any change here should be minimal and validated for cross-layer impact.

## Usage Rules

1. API modules should request via `@/lib/http/ky` wrappers only.
2. Next.js route handlers should use `withResponse` for consistent success/error payloads.
3. Client API state should use the shared `queryClient` from `@/lib/http/react-query`.
4. Shared errors should prefer extending `BaseError` for consistent handling and transport.
5. Utilities should avoid `index.ts` barrel exports. Existing `index.ts` files that contain real implementation code are not barrel exports.

## Testing

Test infrastructure and pure utility behavior without a browser environment. Keep the test beside
the source module:

```text
src/lib/utils/formatter/
  formatters.ts
  test/
    formatters.test.ts
```

Prioritize observable behavior for formatters, error classes, HTTP wrappers, and response helpers.
Mock network transport at `ky` or the project request-wrapper boundary. Keep foundational
infrastructure tests focused and avoid coupling them to internal local variables.

## Checklist For PRs

- Change is in `utils/` unless justified by a new infra-level requirement.
- `src/lib/utils/shadcn/**` is unchanged.
- Request logic uses `httpRequest` / `apiRequest`, not ad-hoc transport code.
- Route handlers use `withResponse` for response consistency.
- Shared errors use `BaseError` hierarchy when appropriate.
- No utility barrel exports are introduced.
- Non-trivial utility and infrastructure behavior has a colocated `.test.ts` file when coverage is
  needed.
