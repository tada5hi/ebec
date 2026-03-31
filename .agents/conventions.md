# Conventions

## TypeScript

- Target: ES2022, module: ESNext, moduleResolution: bundler
- Shared base config: `@tada5hi/tsconfig`
- `noEmit: true` at root — tsdown handles compilation
- Per-package `tsconfig.json` extends root, scoped to `src/**/*.ts`

## Build

- **Bundler**: tsdown (rolldown-based)
- **Output**: dual ESM (`.mjs`) + CJS (`.cjs`) with declarations (`.d.mts`, `.d.cts`) and sourcemaps
- HTTP package runs `build:classes` (code generation) before tsdown

## Linting

- **ESLint v10** with flat config (`eslint.config.js`)
- Extends `@tada5hi/eslint-config`
- Generated error class files are ignored (`**/errors/client/**`, `**/errors/server/**`)
- Key rule overrides: `class-methods-use-this: off`, `@typescript-eslint/no-unused-vars: off`

## Commits

- **Conventional Commits** enforced via commitlint + husky
- Config: `@tada5hi/commitlint-config`
- Prefixes: `feat:`, `fix:`, `build:`, `chore:`, etc.

## CI/CD

Two GitHub Actions workflows:

### `main.yml` (CI)
- Triggers: push/PR to develop, master, next, beta, alpha
- Jobs: install → build → lint + test (parallel)
- Node 22, concurrency groups cancel in-progress runs

### `release.yml` (Release)
- Triggers: push to master
- Uses `googleapis/release-please-action@v4` for version bumps and changelogs
- Publishes to npm via `tada5hi/monoship@v2`
- Packages version independently (configured in `release-please-config.json`)

## Dependency Updates

- Dependabot configured for daily checks
- Groups: major production, major development, minor+patch
- Commit prefixes: `fix:` for production, `build:` for dev dependencies
