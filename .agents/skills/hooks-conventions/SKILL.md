---
name: hooks-conventions
description: Use when building src/hooks hooks, especially src/hooks/api React Query wrappers mapped to src/api domains, including queryKey design, enabled/refetch behavior, mutation invalidation, cache updates, and hook responsibility boundaries.
---

# Hooks Conventions

## Scope

Applies to `src/hooks/**`.

The base template includes no business hooks. Create matching API and hook domains only when a
feature needs them; example paths in this skill do not imply existing source files.

## Structure Rules

1. `src/hooks/api` mirrors `src/api` domains and subfolders.
2. Query hooks live in `query/` and use `useQuery` (create this folder only when query hooks exist).
3. Mutation hooks live in `mutation/` and use `useMutation` (create this folder only when mutation hooks exist).
4. Hook-level helper types live in named files under `types/` when needed.
5. Do not create or update `index.ts` barrel exports.
6. Import hooks from concrete files, not folder paths.

## Hard Boundary Rule

Client components must call APIs through hooks only.

Required flow: `Client Component -> src/hooks/api -> src/api -> apiRequest/httpRequest`.
Hooks call concrete API request functions; transport helpers stay in the API layer.

Not allowed:

- Direct `fetch`/`ky` usage in client components.
- Calling route handlers directly from components.

## Non-API Hooks

Other hooks should be grouped by function/business categories under `src/hooks`.
Current base architecture does not provide non-API folder examples.

## Hook Shape Rules

1. Keep each hook focused on one responsibility.
2. Do not return a large bag of unrelated functions and state from one hook.
3. Split a broad hook into smaller hooks before it becomes a page-level controller.
4. Return only the state and actions the caller needs.
5. Use a Zustand store when multiple distant components need shared app state.

## Workflow

1. Confirm API function exists in `src/api/<domain>/query|mutation`.
2. Create corresponding hook in `src/hooks/api/<domain>/query|mutation`.
3. Use stable `queryKey` design for queries.
4. Add invalidation/update behavior for mutations.
5. Update consumers to import from the concrete hook file.

## React Query Rules

1. Use array query keys.
2. Start query keys with the domain name.
3. Add resource/action segments after the domain.
4. Put params in the final segment as a plain serializable object when params are needed.
5. Do not include functions, class instances, Dates, or unstable objects in query keys.
6. Query hooks call exactly one request function from `src/api` unless composition is explicitly required.
7. Use `enabled` for user-triggered or dependency-gated queries.
8. Mutations should invalidate or update affected query keys after success.

Query hook example in `src/hooks/api/time/query/use-server-time.ts`, paired with
`src/api/time/query/get-server-time.ts`:

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

For a parameterized query, include parameters in the final key segment:

```ts
queryKey: ['user', 'profile', { address }]
```

## Review Checklist

- Hook path mirrors API path.
- Query and mutation hooks use proper React Query primitives.
- Query keys are stable, serializable, and domain-first.
- Mutations update or invalidate the affected cache.
- No empty `query/` or `mutation/` folders were added.
- No `index.ts` barrel exports or folder-level hook imports were added.
- Client code consumes hooks instead of direct request calls.
- Non-API hooks (if added) are categorized clearly.
- Hooks expose focused state/actions instead of large unrelated return objects.
