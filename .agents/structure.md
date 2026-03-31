# Project Structure

## Monorepo Layout

```
ebec/
├── packages/
│   ├── ebec/                  # Core error library
│   │   ├── src/
│   │   │   ├── index.ts       # Barrel export
│   │   │   ├── module.ts      # BaseError class + isBaseError()
│   │   │   ├── types.ts       # Options, Input types
│   │   │   └── utils/
│   │   │       ├── is.ts      # isObject() helper
│   │   │       └── options.ts # extractOptions(), isOptions(), createExtractOptionsFn()
│   │   ├── test/unit/
│   │   ├── tsdown.config.ts
│   │   └── package.json
│   │
│   └── http/                  # HTTP error classes
│       ├── src/
│       │   ├── index.ts       # Barrel export
│       │   ├── types.ts       # HTTP-specific Options (statusCode, statusMessage, redirectURL)
│       │   ├── core-export.ts # Re-exports ebec for ./core subpath
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
│       │   ├── client.json    # 4xx error definitions
│       │   └── server.json    # 5xx error definitions
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
@ebec/http  →  ebec  →  (no runtime deps)
```

`ebec` has zero runtime dependencies. `@ebec/http` depends only on `ebec`.

## Generated Files

Files in `packages/http/src/errors/client/` and `packages/http/src/errors/server/` are **generated** by `npm run build:classes` in the http package. Do not edit these files directly — modify `build/client.json`, `build/server.json`, or `template/error.tpl` instead.

## Package Exports

Both packages produce dual ESM + CJS outputs via tsdown:

| Package | Export | Files |
|---------|--------|-------|
| `ebec` | `.` | `dist/index.{mjs,cjs,d.mts,d.cts}` |
| `@ebec/http` | `.` | `dist/index.{mjs,cjs,d.mts,d.cts}` |
| `@ebec/http` | `./core` | `dist/core/index.{mjs,cjs,d.mts,d.cts}` |

The `./core` subpath re-exports everything from `ebec`, allowing consumers to use `@ebec/http/core` instead of depending on `ebec` directly.
