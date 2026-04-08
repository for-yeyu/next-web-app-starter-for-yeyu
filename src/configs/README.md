# Configs Guide

This directory contains runtime configuration for the app.

Goals:
- Keep environment validation strict and centralized.
- Separate public/shared config from server-only secrets.
- Make imports explicit and predictable.

## Directory Layout

```text
src/configs/
  schema/   # Zod schemas and config types
  shared/   # Non-secret config that can be used by both client and server
  server/   # Server-only config (secrets)
```

## Responsibilities

### `schema/`
- Define only schema and types.
- Do not read `process.env` here.
- Use `schema/index.ts` as the unified export entry.

### `shared/`
- Read `NEXT_PUBLIC_*` (or other non-secret) env vars.
- Validate values with schemas from `../schema`.
- Can be imported by client and server code.
- Must not contain secrets or server-only values.

### `server/`
- Read secret env vars.
- Must include `import 'server-only'`.
- Must never be imported by client components.

## Import Rules

Preferred imports:

```ts
import { sharedConfig } from '@/configs/shared'
import { serverConfig } from '@/configs/server'
```

Schema imports inside `configs` modules should use the unified barrel:

```ts
import { appConfigSchema, envSchema, jwtSecretSchema } from '../schema'
```

## How To Add A New Config

### Add a shared config (client + server safe)

1. Add schema in `src/configs/schema/<name>.ts`.
2. Export it from `src/configs/schema/index.ts`.
3. Create runtime config in `src/configs/shared/<name>.ts` and parse `process.env`.
4. Consume it where needed via `sharedConfig` from `@/configs/shared`.

Example:

```ts
// schema/feature.ts
import { z } from 'zod'

export const featureSchema = z.object({
  featureFlag: z.enum(['on', 'off']),
})
```

```ts
// shared/feature.ts
import { featureSchema } from '../schema'

export const featureConfig = featureSchema.parse({
  featureFlag: process.env.NEXT_PUBLIC_FEATURE_FLAG,
})
```

### Add a server-only config (secret)

1. Add schema in `src/configs/schema/<name>.ts`.
2. Export it from `src/configs/schema/index.ts`.
3. Create `src/configs/server/<name>.ts`.
4. Add `import 'server-only'` at the top.
5. Parse secret env vars there.
6. Use only in server routes/actions/loaders via `serverConfig` from `@/configs/server`.

Example:

```ts
// server/my-secret.ts
import 'server-only'
import { mySecretSchema } from '../schema'

export const mySecretConfig = mySecretSchema.parse({
  mySecret: process.env.MY_SECRET,
})
```

## Design Principles

1. Fail fast: parse config at module load, not lazily.
2. Single source of truth: one schema per config domain.
3. Explicit boundaries: `shared` never depends on `server`.
4. Security first: secrets stay in `server/` only.
5. Small modules: one config topic per file.
6. Stable API: aggregate runtime config through `sharedConfig` and `serverConfig`.

## Checklist For PRs

- New config has schema in `schema/`.
- `schema/index.ts` is updated.
- Secret config file includes `server-only`.
- Runtime config is consumed through `@/configs/shared` or `@/configs/server`.
- `pnpm lint` and `pnpm typecheck` pass.
