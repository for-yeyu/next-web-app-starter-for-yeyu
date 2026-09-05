---
name: configs-conventions
description: Use when adding or updating env validation, client/server env modules, or runtime config consumption patterns in src/configs.
---

# Configs Conventions

## Scope

Applies to `next.config.ts`, `src/configs/**`, and code that consumes runtime config from this layer.

## Structure Rules

```text
src/configs/
  validator/
    validate-public-env.ts   # zod validation for public env
    validate-server-env.ts   # zod validation for server env
  client-env.ts   # client-safe env values
  server-env.ts   # server-only env values and secrets
```

- `src/configs/validator/validate-public-env.ts` and `src/configs/validator/validate-server-env.ts` are the only places zod env validation should be defined.
- `next.config.ts` calls `validatePublicEnv()` and `validateServerEnv()` only; do not inline schemas there.
- `client-env.ts` is the external client-safe config entry and exports `clientEnv`.
- `server-env.ts` is the external secret config entry and exports `serverEnv`.

## Template Defaults

- `serverEnv` and the server validation schema start empty. Keep both as extension points; no
  private variable is required until a feature needs it.
- The tracked `.env.development` and `.env.production` files contain client-safe starter values.
- Store real secrets in ignored `.env.local` files or deployment configuration, not tracked files.
- Preserve existing public fields when extending configuration. Use `NEXT_PUBLIC_*` only for
  values that may be exposed to the browser.

## Hard Rules

1. Do not create root-level `config/` directories for env validation.
2. Do not create old `schema/`, `shared/`, or `server/` config directories.
3. Do not import `zod` from `client-env.ts` or `server-env.ts`; zod validation must stay in `src/configs/validator/validate-*.ts`.
4. `client-env.ts` reads `NEXT_PUBLIC_*` and other client-safe values only.
5. `server-env.ts` reads secret env values and must include `import 'server-only'`.
6. Client modules must not import `@/configs/server-env`.
7. External runtime config consumption must go through `@/configs/client-env` or `@/configs/server-env`.
8. Runtime env modules expose already-validated values with narrow TypeScript types.
9. Never return server secrets from API handlers or pass them to client components.

## Workflow

1. Add or update the zod schema and its `parse` input in `src/configs/validator/validate-public-env.ts` or `src/configs/validator/validate-server-env.ts`.
2. Add the typed value to `src/configs/client-env.ts` or `src/configs/server-env.ts`.
3. Consume runtime values via `@/configs/client-env` or `@/configs/server-env`.
4. If external code needs a config-derived type, export that type from the same env module.

## Server Env Example

This example shows how to add a private value when needed; it is not a required starter setting.

`src/configs/validator/validate-server-env.ts`:

```ts
import { z } from 'zod'

const serverEnvSchema = z.object({
  API_SECRET: z.string().trim().min(1, 'API_SECRET is required'),
})

export const validateServerEnv = () => {
  serverEnvSchema.parse({
    API_SECRET: process.env.API_SECRET,
  })
}
```

`src/configs/server-env.ts`:

```ts
import 'server-only'

export const serverEnv = {
  apiSecret: process.env.API_SECRET as string,
}
```

## Config Testing

- Test validators as plain functions with Vitest under `src/configs/validator/test/` and runtime
  env modules under `src/configs/test/`, using the source basename plus `.test.ts`.
- Cover valid values and relevant missing, blank, and invalid-value boundaries.
- Isolate and restore environment changes between tests; do not depend on machine-local values.
- Assert exposed config values and public validation errors, not schema implementation details.

## Review Checklist

- Zod validation remains in `src/configs/validator/validate-*.ts`.
- `next.config.ts` only calls env validation functions.
- `client-env.ts` and `server-env.ts` have no `zod` imports.
- Secret config uses `server-only`.
- `client-env.ts` and `server-env.ts` remain the only runtime env entry points.
- No external imports remain from old `@/configs/shared`, `@/configs/server`, or `@/configs/schema` paths.
- Import boundaries remain explicit and safe.
