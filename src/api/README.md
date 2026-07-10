# API Guide

This directory stores API request functions by domain.

Goals:
- Keep network request logic centralized in `src/api`.
- Separate read/write behavior with `query` and `mutation`.
- Keep request and response contracts explicit in `types`.
- Import request functions and contracts from concrete files.

## Directory Layout

```text
src/api/
  <domain>/
    mutation/              # Write/update requests and side-effect actions
    query/                 # Read/fetch requests
    types/                 # API params and response types in named files
```

## Import Rules

Do not create or use `index.ts` barrel exports in `src/api`.

Use concrete file imports:

```ts
import { getServerTime } from '@/api/time/query/get-server-time'
import type { GetServerTimeResult } from '@/api/time/types/get-server-time-result'
```

## Request Rules

All request functions in `src/api` must use wrapped functions from `@/lib/http/ky`.

1. If the target endpoint is under Next.js route handlers (`src/app/api/**`), use `apiRequest`.
2. If the target endpoint is not from `src/app/api/**`, use `httpRequest`.
3. Do not use direct `fetch`, raw `ky`, or other ad-hoc request approaches inside `src/api`.

## Client Boundary

Client page components must not request server APIs directly.

Allowed flow:
1. Component uses hook from `src/hooks`.
2. Hook calls function from `src/api`.
3. API function performs request through `apiRequest` or `httpRequest`.

## Testing

API request functions are tested without rendering UI or starting a server.

Place the test next to the request function:

```text
src/api/time/query/
  get-server-time.ts
  test/
    get-server-time.test.ts
```

Test the request function's public behavior:

- the wrapped transport helper and request URL;
- the returned response value;
- error propagation and conversion at the API boundary.

Mock `apiRequest` or `httpRequest` at the transport boundary. Do not mock the request function
itself or duplicate the implementation inside the test.

## Checklist For PRs

- API functions are placed in `query` or `mutation` correctly.
- Shared contracts are defined in named files under `types`.
- Imports point to concrete files instead of folder-level `index.ts` barrels.
- `src/app/api/**` endpoints use `apiRequest`.
- Non-`src/app/api/**` endpoints use `httpRequest`.
- Client components consume API through hooks, not direct requests.
- API tests are colocated in a nested `test/` directory and use matching `.test.ts` filenames.
