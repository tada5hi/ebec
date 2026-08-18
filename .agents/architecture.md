# Architecture

## Class Hierarchy

```
Error (native)
  └── BaseError (@ebec/core)
        └── HTTPError (@ebec/http)
              ├── ClientError
              │     └── BadRequestError, NotFoundError, ... (generated)
              └── ServerError
                    └── InternalServerError, BadGatewayError, ... (generated)
```

## BaseError Properties

```typescript
class BaseError extends Error {
    readonly code: string;             // Error identifier, derived from class name if not provided
    readonly errors?: ReadonlyArray<Error>; // Collection of errors for batch/group scenarios
    readonly issues: ReadonlyArray<Issue>; // Structured validation failures (issue tree); always an array
    override cause?: unknown;          // Underlying cause
}
```

### Defaults

- **`message`**: Defaults to `"An error occurred"` when not provided
- **`code`**: Derived from class name via PascalCase → CONSTANT_CASE (e.g. `NotFoundError` → `NOT_FOUND_ERROR`). Explicit `code` in options takes priority.
- **`messageData`**: Accepted in constructor options for message template interpolation only — not stored as a property

### Serialization

`toJSON()` returns `{ name, message, code, cause?, errors?, issues?, '@instanceof' }`. If `cause` is a `BaseError`, it is serialized recursively via `toJSON()`. Otherwise, the raw cause value is included. `issues` is emitted only when non-empty — lossless, because the constructor defaults it back to `[]` on rehydration.

The `@instanceof` key carries the class-marker chain (see below) as a string list — the markers' `Symbol.for(...)` registry keys — since symbols are dropped by `JSON.stringify`. `serializeInstanceofChain(input)` produces this form.

## Issue Model

`@ebec/core` owns the issue-tree model that `BaseError.issues` carries, absorbed from the `blemish` package it replaces. An issue is either an **item** (a leaf) or a **group** (a node with children), and every node carries its **absolute path** from the root of the validated structure — a leaf three groups deep still reads `['user', 'contact', 'email']`, never `['email']` relative to its parent.

That invariant is maintained by the producer, not automatically. A library validating a sub-structure and merging the results into a parent tree must rebase the children as it merges; `prefixIssuePath(issue, prefix)` is that step, and it recurses into groups so nested leaves are rebased too.

Build issues with the factories (`defineIssueItem`, `defineIssueGroup`) rather than object literals — the factories apply the compile-time `data` gatekeep that makes a translation catalog safe to write. The guards are duck-typed rather than `instanceof`-based, deliberately: a tree assembled across package or realm boundaries has no shared class to check against.

## @instanceof Markers

Every class in the hierarchy declares a `Symbol.for(...)` marker (e.g. `BASE_ERROR_INSTANCE`, `HTTP_ERROR_INSTANCE`) and appends it to the instance's non-enumerable `@instanceof` chain via `markInstanceof(this, MARKER)` in its constructor. Subclass instances accumulate markers from every ancestor, so a parent-class guard can fast-path-match a subclass instance across bundle/realm boundaries.

- `hasInstanceof(input, marker)` — strict form, matches the marker symbol only
- `matchesInstanceof(input, marker)` — matches the symbol **or** its description string; use this as the guard fast path so the inheritance match survives a JSON round-trip (`toJSON()` serializes the chain to strings)

## HTTPError Properties

```typescript
class HTTPError extends BaseError {
    readonly status: number;           // HTTP status (400-599), defaults to 500
    get statusCode(): number;          // @deprecated — alias for `status`
    readonly redirectURL?: string;     // For redirect responses
}
```

### Status Validation

- Invalid status codes (outside 400-599) are sanitized to 500
- Constructor accepts both `status` and `statusCode` options; `status` takes precedence
- Generated subclasses use nullish coalescing (`??`) to preserve their default status when the user passes `undefined`

## Flexible Constructor Pattern

Both `BaseError` and `HTTPError` accept variadic `Input[]` arguments. Each input can be a string, an Error, or an Options object. The `extractOptions()` function merges them left to right:

```typescript
// All of these work:
new BaseError('something failed');
new BaseError({ code: 'FAIL', data: { id: 123 } });
new BaseError('message', { code: 'FAIL' });
new BaseError(existingError, { code: 'WRAPPED' });
```

## Options Extraction Factory

`createExtractOptionsFn<T>(checkFn)` is the core utility. It creates a type-safe extractor:

1. Strings → `message`
2. Error instances → `message`, `stack`, `cause` (non-enumerable properties)
3. Objects passing `checkFn` → merge all enumerable keys (unsafe keys like `__proto__`, `constructor`, `prototype` are filtered)

The `@ebec/core` package creates its extractor with `isOptions()`. The `@ebec/http` package creates its own with an extended `isHTTPErrorOptions()` that also validates `status`, `statusCode`, and `redirectURL`.

## Code Generation (HTTP Package)

The http package generates error classes from JSON config + Mustache template:

1. **Config**: `build/client.json` and `build/server.json` — simple `{ ClassName: statusCode }` format, with optional object form for edge cases requiring explicit `statusMessage` or `code` overrides
2. **Derivation**: `code` (CONSTANT_CASE) and `statusMessage` (space-separated words) are derived from the PascalCase key name. Explicit values in the config override derivation.
3. **Template**: `template/error.tpl` produces a class extending `ClientError` or `ServerError`
4. **Script**: `build/index.mjs` renders templates and writes to `src/errors/{client,server}/`, and generates `src/constants.ts` (the `STATUS_TEXTS` map)
5. **Barrel exports**: Auto-generated `index.ts` files in each subdirectory

To add a new HTTP error: add an entry to the appropriate JSON file and run `npm run build:classes -w packages/http`.

## Type Guards

Identity is chain-only. Each class-identity guard (`isBaseError`, `isHTTPError`) is a single check: `matchesInstanceof(x, MARKER)` against its own class marker. There is no shape/duck-typing fallback — an object that merely looks right (Error-shaped with a string `code`, or carrying a `status` field) but was never marked no longer matches. `matchesInstanceof` covers both the in-process symbol chain and the string chain that `toJSON()` emits, so the match survives a JSON round-trip; only errors actually produced by `@ebec/core`/`@ebec/http` (or explicitly marked via `markInstanceof`) carry that chain.

`isClientError`/`isServerError` are not class-identity checks — they are status-range refinements of `isHTTPError`. Each first matches its own marker (`CLIENT_ERROR_INSTANCE`/`SERVER_ERROR_INSTANCE`) as a fast path, and otherwise delegates identity to `isHTTPError` (chain-only itself) and decides by `status` range from there. That's why a bare `new HTTPError({ status: 404 })` — which never marks itself as a `ClientError` — still matches `isClientError`: it's a confirmed `HTTPError` by chain, refined by status. Do not "fix" this by gating on the subclass marker alone.

| Function | Package | Checks |
|----------|---------|--------|
| `isBaseError(x)` | @ebec/core | `matchesInstanceof(x, BASE_ERROR_INSTANCE)` — chain-only |
| `isErrorWithCode(x, code)` | @ebec/core | isBaseError + code matches (single or array) |
| `isHTTPError(x)` | @ebec/http | `matchesInstanceof(x, HTTP_ERROR_INSTANCE)` — chain-only |
| `isClientError(x)` | @ebec/http | Own marker match, else `isHTTPError` (chain-confirmed) + status 400-499 |
| `isServerError(x)` | @ebec/http | Own marker match, else `isHTTPError` (chain-confirmed) + status 500-599 |

New identity guards must use `matchesInstanceof` (not `hasInstanceof`), so JSON-rehydrated errors keep the inheritance match — `hasInstanceof` only matches the native symbol chain and misses the string chain a JSON round-trip produces. A guard that is a class-identity check reduces to that single `matchesInstanceof` call; a guard that is a status/shape refinement of another guard (like `isClientError`/`isServerError`) should delegate identity to that guard rather than duplicating a marker/chain check.
