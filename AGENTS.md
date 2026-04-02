<!-- NOTE: Keep this file and all corresponding files in the .agents directory updated as the project evolves. When making architectural changes, adding new patterns, or discovering important conventions, update the relevant sections. -->

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

- **Node.js**: >=22.0.0
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
