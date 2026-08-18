# Project Structure

## Monorepo Layout

```
ebec/
├── assets/
│   └── logo.svg               # Root README logo
├── packages/
│   ├── core/                  # Core error library (@ebec/core)
│   │   ├── assets/logo.svg    # README logo (shipped in the npm tarball)
│   │   ├── src/
│   │   │   ├── index.ts       # Barrel export
│   │   │   ├── module.ts      # BaseError class
│   │   │   ├── catalog.ts     # defineErrorCatalog()
│   │   │   ├── types.ts       # ErrorInput, IBaseError types
│   │   │   ├── options/       # Options handling
│   │   │   │   ├── module.ts  # isErrorOptions(), extractErrorOptions()
│   │   │   │   └── types.ts   # ErrorOptions type
│   │   │   ├── issue/         # Issue tree model (absorbed from blemish)
│   │   │   │   ├── check.ts       # isIssue(), isIssueItem(), isIssueGroup()
│   │   │   │   ├── constants.ts   # IssueCode vocabulary
│   │   │   │   ├── define.ts      # defineIssueItem(), defineIssueGroup()
│   │   │   │   ├── flatten.ts     # flattenIssueItems(), flattenIssueGroups()
│   │   │   │   ├── format.ts      # formatIssue()
│   │   │   │   ├── prefix.ts      # prefixIssuePath()
│   │   │   │   └── types.ts       # Issue, IssueItem, IssueGroup
│   │   │   └── helpers/
│   │   │       ├── check.ts        # isBaseError(), isBaseErrorGroup()
│   │   │       ├── error.ts        # isError()
│   │   │       ├── error-code.ts   # isErrorWithCode()
│   │   │       ├── instanceof.ts   # markInstanceof(), hasInstanceof(), matchesInstanceof(), serializeInstanceofChain()
│   │   │       ├── interpolate.ts  # Message template interpolation
│   │   │       ├── object.ts       # isObject() helper
│   │   │       ├── sanitize-code.ts # sanitizeErrorCode()
│   │   │       └── serialize.ts    # toSerializable()
│   │   ├── test/unit/
│   │   ├── tsdown.config.ts
│   │   └── package.json
│   │
│   └── http/                  # HTTP error classes (@ebec/http)
│       ├── assets/logo.svg    # README logo (shipped in the npm tarball)
│       ├── src/
│       │   ├── index.ts       # Barrel export
│       │   ├── constants.ts   # Generated STATUS_TEXTS map (statusCode → reason phrase)
│       │   ├── types.ts       # HTTPErrorOptions, HTTPErrorInput types
│       │   ├── core-export.ts # Re-exports @ebec/core for ./core subpath
│       │   ├── utils/
│       │   │   ├── options.ts     # isHTTPErrorOptions()
│       │   │   ├── sanitize.ts    # sanitizeStatusCode()
│       │   │   └── status-text.ts # getStatusText()
│       │   └── errors/
│       │       ├── base/      # HTTPError, ClientError, ServerError + types
│       │       ├── client/    # Generated 4xx error classes (31 files)
│       │       └── server/    # Generated 5xx error classes (12 files)
│       ├── build/             # Code generation for error classes
│       │   ├── index.mjs      # Generator script with derivation helpers
│       │   ├── utils.mjs      # File I/O helpers
│       │   ├── client.json    # 4xx error definitions (key: statusCode, with optional overrides)
│       │   └── server.json    # 5xx error definitions (key: statusCode, with optional overrides)
│       ├── template/
│       │   └── error.tpl      # Mustache template for error classes
│       ├── test/unit/
│       ├── tsdown.config.ts
│       └── package.json
│
├── docs/
│   └── superpowers/            # Design specs and implementation plans
│       ├── specs/
│       └── plans/
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
```

`@ebec/core` (packages/core) is the canonical implementation, with zero runtime dependencies. It owns both the error classes and the issue model that `BaseError.issues` carries — the latter absorbed from the `blemish` package, which it replaces. `@ebec/http` depends on `@ebec/core`.

## README Logos

Every README — the root one and both packages — opens with a centred `<p align="center">` logo block, an `<h1 align="center">`, and a one-line bold tagline above the badges, following [tada5hi/ilingo@bf1ed8a](https://github.com/tada5hi/ilingo/commit/bf1ed8a5bc28206f5783452d8929234d12a467f5). The logos are one family: a **stop-sign octagon** — the shape of "halt, something went wrong" — filled with a per-package gradient and carrying a per-package white glyph, at `<pkg>/assets/logo.svg`.

The octagon is a single path, its corners rounded by stroking it with its own gradient at `stroke-linejoin="round"`, so the mark stays one shape in every file. Glyphs are drawn directly in body coordinates (roughly x/y 68–188, centred on 128) — no nested `transform`, so the numbers in the file are the numbers on screen. `#FBBF24` is the family's single accent.

| Mark | Gradient | Glyph |
|------|----------|-------|
| root `ebec` | `#F43F5E` → `#7C3AED` | a white bang — the error itself |
| `@ebec/core` | same as root | the same bang, point in `#FBBF24` — the code that names it |
| `@ebec/http` | `#3B82F6` → `#06B6D4` | a white globe, equator in `#FBBF24` — the transport layer |

Root and core are deliberately near-identical, differing only by that one accent; they are the only two marks allowed to be.

**The `<img>` tags carry no `width`/`height` attributes** — each SVG declares `width="128" height="128"` on its root element instead, keeping `viewBox="0 0 256 256"` so the artwork coordinates stay unscaled. GitHub's markdown pipeline injects a `background-color: var(--bgColor-muted); border-radius: 6px` loading placeholder into any `<img>` that carries explicit dimensions, and that grey rounded panel stays visible behind a transparent logo. Without the attributes GitHub emits `style="max-width: 100%;"` only. Verify any change to these tags with `gh api -X POST /markdown --input <file>` and grep the result for `bgColor-muted`.

**Package READMEs reference the logo by absolute `https://raw.githubusercontent.com/tada5hi/ebec/HEAD/packages/<pkg>/assets/logo.svg` URL**, not a relative path — a relative `src` resolves against `npmjs.com` and 404s there. Both packages therefore list `assets` in their `package.json` `files` array so the SVG ships in the tarball. The root README is GitHub-only, so it uses `./assets/logo.svg`.

## Generated Files

Files in `packages/http/src/errors/client/`, `packages/http/src/errors/server/`, and `packages/http/src/constants.ts` are **generated** by `npm run build:classes` in the http package. Do not edit these files directly — modify `build/client.json`, `build/server.json`, or `template/error.tpl` instead. The JSON configs use a simplified format: `{ "ClassName": statusCode }` for simple cases, or `{ "ClassName": { "statusCode": N, "statusMessage": "..." } }` for edge cases requiring explicit overrides. The `code` and `statusMessage` are derived from the class name by default.

## Package Exports

Both packages produce dual ESM + CJS outputs via tsdown:

| Package | Export | Files |
|---------|--------|-------|
| `@ebec/core` | `.` | `dist/index.{mjs,cjs,d.mts,d.cts}` |
| `@ebec/http` | `.` | `dist/index.{mjs,cjs,d.mts,d.cts}` |
| `@ebec/http` | `./core` | `dist/core/index.{mjs,cjs,d.mts,d.cts}` |

The `./core` subpath on `@ebec/http` re-exports everything from `@ebec/core`, allowing consumers to use `@ebec/http/core` instead of depending on `@ebec/core` directly.
