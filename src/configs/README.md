# Configs Guide

This directory contains the runtime environment config entry points.

Goals:
- Keep client-safe values separate from server-only secrets.
- Keep zod out of application runtime imports.
- Validate env values before the app is bundled.

## Directory Layout

```text
src/configs/
  validator/
    validate-public-env.ts   # zod validation for public env
    validate-server-env.ts   # zod validation for server env
  client-env.ts   # NEXT_PUBLIC_* and other client-safe env values
  server-env.ts   # server-only env values and secrets
```

## Validation

Zod env validation lives in `src/configs/validator/validate-public-env.ts` and `src/configs/validator/validate-server-env.ts`.

`next.config.ts` should only call `validatePublicEnv()` and `validateServerEnv()`. Do not define schemas inline there.

Do not import `zod` from `src/configs/client-env.ts` or `src/configs/server-env.ts`. Those env modules should only expose already-validated values from `process.env` with narrow TypeScript types.

## Import Rules

Client-safe values:

```ts
import { clientEnv } from '@/configs/client-env'
```

Server-only values:

```ts
import { serverEnv } from '@/configs/server-env'
```

`server-env.ts` must include `import 'server-only'` and must never be imported by client components.

The starter exports an empty `serverEnv` and validates an empty server schema. No private env
variables are required until a feature needs them. Keep both entry points as extension points.
Never return server secrets from an API handler or pass them to client components.

The tracked `.env.development` and `.env.production` files contain only client-safe starter values.
Store real secrets in ignored `.env.local` files or deployment configuration, not tracked files.

## How To Add Env Values

1. Add the value to the matching zod schema and its `parse` input in `src/configs/validator/validate-public-env.ts` or `src/configs/validator/validate-server-env.ts`.
2. Add the typed value to `clientEnv` or `serverEnv`.
3. Consume values through `@/configs/client-env` or `@/configs/server-env`.

For public values, follow the existing `NEXT_PUBLIC_APP_NAME` field and preserve the other
configured fields. Only use `NEXT_PUBLIC_*` for values that may be exposed to the browser.

Server-only example (documentation only; no secret is required by the starter):

`src/configs/validator/validate-server-env.ts`

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

`src/configs/server-env.ts`

```ts
import 'server-only'

export const serverEnv = {
  apiSecret: process.env.API_SECRET as string,
}
```

## Testing

Environment validators are tested as plain functions in the same module directory:

```text
src/configs/validator/
  validate-public-env.ts
  validate-server-env.ts
  test/
    validate-public-env.test.ts
    validate-server-env.test.ts
```

Cover valid values and each meaningful validation boundary, including missing, blank, and invalid
environment values. Isolate environment changes between tests and assert validation errors through
the validator's public behavior.

## Checklist For PRs

- Zod validation stays in `src/configs/validator/validate-*.ts`.
- `next.config.ts` only calls env validation functions.
- `client-env.ts` and `server-env.ts` do not import `zod`.
- Client-safe values are exported from `clientEnv`.
- Secrets are exported from `serverEnv`.
- Client components never import `serverEnv`.
- Validator tests are colocated under `src/configs/validator/test`.
