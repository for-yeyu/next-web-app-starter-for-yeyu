---
name: configs-conventions
description: Use when adding or updating runtime configuration schemas, shared/server config modules, or runtime config consumption patterns in src/configs.
---

# Configs Conventions

## Scope

Applies to `src/configs/**` and to code that consumes runtime config from this layer.

## Structure Rules

```text
src/configs/
  schema/   # schema + config types only
  shared/   # non-secret runtime config (client+server safe)
  server/   # secret runtime config (server-only)
```

- `shared/index.ts` is the external runtime config entry and exports `sharedConfig`.
- `server/index.ts` is the external secret config entry and exports `serverConfig`.

## Hard Rules

1. `schema/` defines schemas/types only and does not read `process.env`.
2. `shared/` reads non-secret env values and validates via `schema`.
3. `server/` reads secret env values and must include `import 'server-only'`.
4. `shared` modules must not depend on `server` modules.
5. `schema/index.ts` is the unified schema export entry.
6. External runtime config consumption must go through `@/configs/shared` or `@/configs/server`.
7. Do not import `@/configs/shared/*` or `@/configs/server/*` directly outside config implementation files.
8. Internal config modules may import sibling config modules only when needed for initialization order or to avoid circular barrel usage.

## Workflow

1. Add schema in `schema/<name>.ts`.
2. Export schema from `schema/index.ts`.
3. Add runtime parser in `shared/<name>.ts` or `server/<name>.ts`.
4. Aggregate the new runtime exports through `sharedConfig` or `serverConfig` in the corresponding `index.ts`.
5. Consume runtime values via `@/configs/shared` or `@/configs/server`.
6. If external code needs a config-derived type, export that type from the barrel entry as well.

## Review Checklist

- New config has schema in `schema/`.
- `schema/index.ts` is updated.
- Secret config uses `server-only`.
- `shared/index.ts` and `server/index.ts` remain the external runtime config entry points.
- No external direct imports remain from `@/configs/shared/*` or `@/configs/server/*`.
- Import boundaries remain explicit and safe.

## References

- `src/configs/README.md`
