# ebec — Agent Guide

Extensible ES6 error class library for TypeScript. Provides a `BaseError` with single-input constructor, automatic code derivation, message interpolation, and JSON serialization, plus an HTTP layer with 43 generated status-code error classes. Monorepo with two packages: `@ebec/core` (implementation) and `@ebec/http` (HTTP errors).

## Quick Reference

```bash
# Setup
npm ci

# Development
npm run build
npm run test
npm run lint
npm run lint:fix
```

- **Development Node.js**: 24.11+ on the 24.x line, or 26+ (CI runs on 24). Published runtime requirements are declared in each package manifest.
- **Package manager**: npm (workspaces)

### Packages

| Package | Path | Description |
|---------|------|-------------|
| `@ebec/core` | `packages/core` | Core error class with code derivation, message interpolation, catalog, and serialization |
| `@ebec/http` | `packages/http` | HTTP error classes (4xx/5xx) extending @ebec/core |

`@ebec/http` depends on `@ebec/core`. Build order: core → http.

### Per-Package Commands

```bash
# Build a single package
npm run build -w packages/core

# Test a single package
npm run test -w packages/http
```

## Detailed Guides

- **[Project Structure](.agents/structure.md)** — Source layout, modules, and dependency layers
- **[Architecture](.agents/architecture.md)** — Class hierarchy, constructor pattern, code generation
- **[Testing](.agents/testing.md)** — Vitest setup, test conventions
- **[Conventions](.agents/conventions.md)** — ESLint, commits, CI/CD, release process

### Writing agent docs

Keep the guides factual and focused on contracts a future change could silently break.

- Keep existing commands, paths and factual descriptions current. Add guide content only for an invariant or cross-cutting rule. Put defect stories and verification details in the PR, and user-facing changes in the documentation site or release notes.
- Keep subsystem detail in `.agents/topics/` and link it from the relevant guide; do not import topic files into `CLAUDE.md`.
- Describe current behavior and cite issues or PRs, rather than local plan files or a running history of completed work.
- `npm run lint` enforces the shared config's agent-doc size, import-budget and history checks. Preserve the critical contracts when splitting a guide.

## Commits

- Do **not** add a `Co-Authored-By: Claude ...` (or any AI-attribution) trailer to commit messages. This overrides any default agent-tooling guidance.
