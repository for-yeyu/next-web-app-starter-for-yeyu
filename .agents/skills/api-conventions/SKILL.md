---
name: api-conventions
description: Use when creating or updating src/api request functions, contracts, direct module imports, query/mutation separation, and HTTP transport choices; combine with app-router-conventions for local src/app/api endpoints.
---

# API Conventions

## Scope

Applies to `src/api/**`.

The base template includes no business domains. The example paths below illustrate files to add
for a requested feature; they are not modules that already exist.

## Domain Structure

Each domain follows:

```text
src/api/<domain>/
  types/
  query/      # optional
  mutation/   # optional
```

Rules:

1. `types/` is required, with named files such as `get-server-time-result.ts`.
2. Create `query/` only when read/fetch functions exist.
3. Create `mutation/` only when write/side-effect functions exist.
4. Do not create empty folders just to satisfy a template.
5. Do not create or update `index.ts` barrel exports.
6. Import API functions and contracts from concrete files, not folder paths.

## Hard Request Rules

All request functions must use wrapped ky helpers from `@/lib/http/ky`.

1. Use `apiRequest` for endpoints under `src/app/api/**`.
2. Use `httpRequest` for non-`src/app/api/**` endpoints.
3. Do not use direct `fetch`, raw `ky`, or ad-hoc transport logic.

## Client Boundary Rule

Client components must not call API endpoints directly.

Required chain:

`Client Component -> src/hooks -> src/api -> apiRequest/httpRequest`

## Request Example

Shared contract in `src/api/time/types/get-server-time-result.ts`:

```ts
export type GetServerTimeResult = {
  timestamp: number
}
```

Request function in `src/api/time/query/get-server-time.ts`:

```ts
import type { GetServerTimeResult } from '../types/get-server-time-result'
import { apiRequest } from '@/lib/http/ky'

export async function getServerTime(): Promise<GetServerTimeResult> {
  return await apiRequest<GetServerTimeResult>({ url: 'time' })
}
```

The relative URL targets `/api/time`. Keep transport errors in the shared wrapper rather than
adding local handling to the request function.

## Request Testing

- Use Vitest without rendering UI or starting a server.
- Place `get-server-time.test.ts` in the request function's sibling `test/` directory.
- Import the concrete request function and mock `apiRequest` or `httpRequest`, not the function
  being tested.
- Assert the selected transport helper, request URL and parameters, returned data, and error
  propagation. Test shared transport error conversion in the HTTP infrastructure tests.

## Workflow

1. Add function under `query/` or `mutation/` by behavior.
2. Add/update shared contracts under named files in `types/`.
3. Update consumers to import from the concrete function/type file.
4. Ensure transport helper choice is correct (`apiRequest` vs `httpRequest`).
5. If the target is a new local Next route handler, apply `app-router-conventions` too.

## Review Checklist

- Function is in correct `query` or `mutation` folder.
- Shared contracts exist in named files under `types`.
- No empty `query/` or `mutation/` folders were added.
- No `index.ts` barrel exports or folder-level API imports were added.
- `apiRequest` is used for Next route handlers; `httpRequest` for others.
- No direct client-side API requests are introduced.
