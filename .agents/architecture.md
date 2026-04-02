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
    override cause?: unknown;          // Underlying cause
}
```

### Defaults

- **`message`**: Defaults to `"An error occurred"` when not provided
- **`code`**: Derived from class name via PascalCase → CONSTANT_CASE (e.g. `NotFoundError` → `NOT_FOUND_ERROR`). Explicit `code` in options takes priority.
- **`messageData`**: Accepted in constructor options for message template interpolation only — not stored as a property

### Serialization

`toJSON()` returns `{ name, message, code, cause? }`. If `cause` is a `BaseError`, it is serialized recursively via `toJSON()`. Otherwise, the raw cause value is included.

## HTTPError Properties

```typescript
class HTTPError extends BaseError {
    readonly statusCode: number;       // HTTP status (400-599), defaults to 500
    readonly statusMessage?: string;   // HTTP reason phrase (ASCII printable, max 256 chars)
    readonly redirectURL?: string;     // For redirect responses
}
```

### StatusCode Validation

- Invalid status codes (outside 100-599) are sanitized to 500
- Generated subclasses use nullish coalescing (`??`) to preserve their default statusCode when the user passes `undefined`

### StatusMessage Sanitization

- Only ASCII printable characters (0x20-0x7E) are allowed
- Whitespace is trimmed
- Maximum length is 256 characters

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

The `@ebec/core` package creates its extractor with `isOptions()`. The `@ebec/http` package creates its own with an extended `isOptions()` that also validates `statusCode`, `statusMessage`, and `redirectURL`.

## Code Generation (HTTP Package)

The http package generates error classes from JSON config + Mustache template:

1. **Config**: `build/client.json` and `build/server.json` — simple `{ ClassName: statusCode }` format, with optional object form for edge cases requiring explicit `statusMessage` or `code` overrides
2. **Derivation**: `code` (CONSTANT_CASE) and `statusMessage` (space-separated words) are derived from the PascalCase key name. Explicit values in the config override derivation.
3. **Template**: `template/error.tpl` produces a class extending `ClientError` or `ServerError`
4. **Script**: `build/index.mjs` renders templates and writes to `src/errors/{client,server}/`
5. **Barrel exports**: Auto-generated `index.ts` files in each subdirectory

To add a new HTTP error: add an entry to the appropriate JSON file and run `npm run build:classes -w packages/http`.

## Type Guards

Each level provides a type guard for duck-type checking:

| Function | Package | Checks |
|----------|---------|--------|
| `isBaseError(x)` | @ebec/core | Is object with valid Options shape + string message |
| `isErrorWithCode(x, code)` | @ebec/core | isBaseError + code matches (single or array) |
| `isHTTPError(x)` | @ebec/http | Is error with numeric statusCode 400-599 |
| `isClientError(x)` | @ebec/http | isHTTPError + statusCode 400-499 |
| `isServerError(x)` | @ebec/http | isHTTPError + statusCode 500-599 |
