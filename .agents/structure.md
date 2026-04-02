# Project Structure

## Monorepo Layout

```
ebec/
├── packages/
│   ├── core/                  # Core error library (@ebec/core)
│   │   ├── src/
│   │   │   ├── index.ts       # Barrel export
│   │   │   ├── module.ts      # BaseError class
│   │   │   ├── check.ts       # isBaseError()
│   │   │   ├── catalog.ts     # defineErrorCatalog()
│   │   │   ├── types.ts       # ErrorInput, IBaseError types
│   │   │   ├── options/       # Options extraction
│   │   │   │   ├── check.ts   # isOptions(), isError()
│   │   │   │   ├── module.ts  # createExtractOptionsFn(), extractOptions()
│   │   │   │   └── types.ts   # Options type
│   │   │   └── helpers/
│   │   │       ├── check.ts       # isBaseError()
│   │   │       ├── error-code.ts  # isErrorWithCode()
│   │   │       ├── interpolate.ts # Message template interpolation
│   │   │       └── object.ts      # isObject() helper
│   │   ├── test/unit/
│   │   ├── tsdown.config.ts
│   │   └── package.json
│   │
│   ├── ebec/                  # Backwards-compat wrapper (re-exports @ebec/core)
│   │   ├── src/
│   │   │   └── index.ts       # export * from '@ebec/core'
│   │   ├── tsdown.config.ts
│   │   └── package.json
│   │
│   └── http/                  # HTTP error classes (@ebec/http)
│       ├── src/
│       │   ├── index.ts       # Barrel export
│       │   ├── types.ts       # HTTP-specific Options (statusCode, statusMessage, redirectURL)
│       │   ├── core-export.ts # Re-exports @ebec/core for ./core subpath
│       │   ├── utils/
│       │   │   ├── options.ts # HTTP option validation + extractOptions()
│       │   │   └── sanitize.ts# sanitizeStatusCode(), sanitizeStatusMessage()
│       │   └── errors/
│       │       ├── base/      # HTTPError, ClientError, ServerError
│       │       ├── client/    # Generated 4xx error classes (37 files)
│       │       └── server/    # Generated 5xx error classes (12 files)
│       ├── build/             # Code generation for error classes
│       │   ├── index.mjs      # Generator script
│       │   ├── utils.mjs      # File I/O helpers
│       │   ├── client.json    # 4xx error definitions (key: statusCode, with optional overrides)
│       │   └── server.json    # 5xx error definitions (key: statusCode, with optional overrides)
│       ├── template/
│       │   └── error.tpl      # Mustache template for error classes
│       ├── test/unit/
│       ├── tsdown.config.ts
│       └── package.json
│
├── eslint.config.js           # ESLint v10 flat config
├── tsconfig.json              # Root TypeScript config
├── commitlint.config.mjs
├── release-please-config.json
├── .release-please-manifest.json
└── .github/
    ├── workflows/
    │   ├── main.yml           # CI (build, lint, test)
    │   └── release.yml        # Release via release-please + monoship
    └── actions/
        ├── install/           # Composite action: Node setup + npm ci
        └── build/             # Composite action: cached build
```

## Dependency Layer

```
@ebec/http  →  @ebec/core  →  (no runtime deps)
ebec         →  @ebec/core  →  (no runtime deps)
```

`@ebec/core` (packages/core) is the canonical implementation with zero runtime dependencies. `@ebec/http` depends on `@ebec/core`. `ebec` is a thin backwards-compat wrapper that re-exports `@ebec/core`.

## Generated Files

Files in `packages/http/src/errors/client/` and `packages/http/src/errors/server/` are **generated** by `npm run build:classes` in the http package. Do not edit these files directly — modify `build/client.json`, `build/server.json`, or `template/error.tpl` instead. The JSON configs use a simplified format: `{ "ClassName": statusCode }` for simple cases, or `{ "ClassName": { "statusCode": N, "statusMessage": "..." } }` for edge cases requiring explicit overrides. The `code` and `statusMessage` are derived from the class name by default.

## Package Exports

Both packages produce dual ESM + CJS outputs via tsdown:

| Package | Export | Files |
|---------|--------|-------|
| `@ebec/core` | `.` | `dist/index.{mjs,cjs,d.mts,d.cts}` |
| `ebec` | `.` | `dist/index.{mjs,cjs,d.mts,d.cts}` |
| `@ebec/http` | `.` | `dist/index.{mjs,cjs,d.mts,d.cts}` |
| `@ebec/http` | `./core` | `dist/core/index.{mjs,cjs,d.mts,d.cts}` |

The `./core` subpath on `@ebec/http` re-exports everything from `@ebec/core`, allowing consumers to use `@ebec/http/core` instead of depending on `@ebec/core` directly. The `ebec` package is a thin backwards-compat wrapper that also re-exports `@ebec/core`.
