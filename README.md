# Next Web App Starter

A Next.js + React Query starter focused on clean layering:

- `app` is route entry only.
- `ui` is page/component implementation.
- `api` contains request functions.
- `hooks` is the only client-facing API call layer.

## Template Scope

The default template is a minimal application shell, not a demo application. It includes the
shared providers, request/response wrappers, error handling, environment validation, and their
infrastructure tests. It does not ship example pages, API endpoints, or business-domain hooks.
There is no example-cleanup step or script.

Create domain folders only when adding a real feature. The request and hook layers initially
contain documentation only. Code snippets in the guides and agent skills are reference examples,
not routes or modules included in the application.

See [Request Chain Example](#request-chain-example) for one complete, documentation-only request chain.

The tracked `.env.development` and `.env.production` files contain client-safe starter values.
Keep real server secrets in ignored local env files or deployment configuration. The server env
entry and validator start empty; extend both when the application needs private configuration.

## Runtime Requirements

- Node.js `>= 20`
- pnpm `>= 9`

## Common Commands

For local maintainers:

```bash
pnpm dev
pnpm build
pnpm start
pnpm lint
pnpm typecheck
pnpm test
pnpm test:watch
pnpm test:coverage
```

Agents should follow `AGENTS.md` command restrictions instead of running project scripts directly.

## Testing

Vitest covers functions and API behavior only. UI pages, React components, browser behavior, and
`jsdom` are outside the current test scope.

Tests are colocated with the source module in a nested `test/` directory:

```text
src/
  configs/
    validator/
      validate-server-env.ts
      test/
        validate-server-env.test.ts
  lib/
    http/
      next.ts
      test/
        next.test.ts
```

Keep one test file focused on the matching source module. Use `pnpm test` for a one-time local or
CI run, `pnpm test:watch` while developing, and `pnpm test:coverage` to inspect coverage.

## Architecture Overview

```text
src/
  app/        # Next.js route entries (thin layer)
  ui/         # UI implementation (pages + shared components)
  api/        # Request functions by domain (query/mutation/types)
  hooks/      # Hooks layer (React Query wrappers over src/api)
  configs/    # Client/server environment config
  lib/        # Infrastructure layer (errors/http/runtime/utils)
  styles/     # Global style entry, shadcn base css, fonts
```

## Core Layering Rules

1. Client page components must not call network requests directly.
2. Client pages/components call hooks in `src/hooks`.
3. Hooks call request functions in `src/api`.
4. `src/api` uses wrapped ky request helpers only:
   - `apiRequest` for `src/app/api/**` endpoints
   - `httpRequest` for non-`src/app/api/**` endpoints
5. `src/app` should stay minimal and route-focused; page implementation lives in `src/ui/app`.

## Request Chain Example

This is a documentation-only example. None of the files below are included in the default
application. Use the pattern when adding a real feature; there is no demo route to remove first.

The example reads a server timestamp through the project layers:

```text
src/app/examples/server-time/page.tsx
  -> src/ui/app/examples/server-time/index.tsx
  -> src/ui/app/examples/server-time/server-time-value.tsx
  -> src/hooks/api/time/query/use-server-time.ts
  -> src/api/time/query/get-server-time.ts
  -> src/app/api/time/route.ts
```

### Shared Response Contract

`src/api/time/types/get-server-time-result.ts`

```ts
export type GetServerTimeResult = {
  timestamp: number
}
```

### Server Route

`src/app/api/time/route.ts`

```ts
import type { GetServerTimeResult } from '@/api/time/types/get-server-time-result'
import { withResponse } from '@/lib/http/next'

export const GET = withResponse((): GetServerTimeResult => {
  return { timestamp: Date.now() }
})
```

Return data directly and let `withResponse` serialize it and handle errors. Never return private
environment values to demonstrate server configuration.

### Request Function

`src/api/time/query/get-server-time.ts`

```ts
import type { GetServerTimeResult } from '../types/get-server-time-result'
import { apiRequest } from '@/lib/http/ky'

export async function getServerTime(): Promise<GetServerTimeResult> {
  return await apiRequest<GetServerTimeResult>({ url: 'time' })
}
```

The relative URL targets `/api/time`. Keep transport handling in the shared request wrapper.

### Query Hook

`src/hooks/api/time/query/use-server-time.ts`

```ts
import { useQuery } from '@tanstack/react-query'
import { getServerTime } from '@/api/time/query/get-server-time'

export function useServerTime() {
  return useQuery({
    queryKey: ['time', 'server'],
    queryFn: getServerTime,
  })
}
```

Keep the query key domain-first and let React Query own request state. The template already wires
the shared query client through its providers.

### Client Section

`src/ui/app/examples/server-time/server-time-value.tsx`

```tsx
'use client'

import type { FC } from 'react'
import { useServerTime } from '@/hooks/api/time/query/use-server-time'
import { Button } from '@/ui/shadcn/button'

export const ServerTimeValue: FC = () => {
  const serverTime = useServerTime()

  if (serverTime.isPending) {
    return <p>Loading server time...</p>
  }

  if (serverTime.isError) {
    return <p role="alert">{serverTime.error.message}</p>
  }

  return (
    <div className="space-y-2">
      <p>Timestamp (ms): {serverTime.data.timestamp}</p>
      <Button
        type="button"
        onClick={() => void serverTime.refetch()}
        disabled={serverTime.isFetching}
      >
        Refresh
      </Button>
    </div>
  )
}
```

The component calls only the hook. Loading and error states stay explicit, with no replacement
data or local error suppression.

### Page Composition And Route Entry

`src/ui/app/examples/server-time/index.tsx`

```tsx
import type { FC } from 'react'
import { ServerTimeValue } from './server-time-value'

export const ServerTimePage: FC = () => {
  return (
    <div className="container space-y-4">
      <h1 className="font-semibold text-3xl tracking-tight">Server Time</h1>
      <ServerTimeValue />
    </div>
  )
}
```

`src/app/examples/server-time/page.tsx`

```tsx
import { ServerTimePage } from '@/ui/app/examples/server-time/index'

export default function Page() {
  return <ServerTimePage />
}
```

Keep route entries thin and put interactive sections in focused client components.

### Tests When Adding The Feature

- Add request tests at `src/api/time/query/test/get-server-time.test.ts`, mock `apiRequest`, and
  verify the request URL, returned value, and error propagation.
- Add handler tests at `src/app/api/time/test/route.test.ts`, fix the clock, and verify the HTTP
  status and response body without starting a server.
- Keep shared transport and response tests in their infrastructure directories. Do not add page,
  component, or browser tests under the current project test scope.

See `src/api/README.md`, `src/app/README.md`, and `.agents/skills/testing-conventions/SKILL.md`
for the testing conventions.

## Documentation Index

- `AGENTS.md`: Agent-specific command, code style, and workflow instructions
- `.agents/skills/*/SKILL.md`: Modular agent conventions for project layers
- `.agents/skills/testing-conventions/SKILL.md`: Function and API testing conventions
- `src/app/README.md`: App Router entry-layer conventions
- `src/ui/README.md`: UI structure and component organization
- `src/api/README.md`: API request layer rules
- `src/hooks/README.md`: Hook layer and React Query conventions
- `src/configs/README.md`: Env validation and client/server config boundaries
- `src/lib/README.md`: Infrastructure modules and change policy
- `src/styles/README.md`: Style entry and CSS extension rules
