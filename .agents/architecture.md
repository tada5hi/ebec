# Architecture

## Class Hierarchy

```
Error (native)
  └── BaseError (ebec)
        └── HTTPError (@ebec/http)
              ├── ClientError (expose: true)
              │     └── BadRequestError, NotFoundError, ... (generated)
              └── ServerError (expose: false)
                    └── InternalServerError, BadGatewayError, ... (generated)
```

## BaseError Properties

```typescript
class BaseError extends Error {
    code?: string | number | null;   // Error identifier (e.g. "NOT_FOUND")
    data?: unknown;                  // Arbitrary context data
    expose?: boolean;                // Safe to show to end users?
    logMessage?: boolean;            // Should be logged?
    logLevel?: string | number;      // Log severity
    override cause?: unknown;        // Underlying cause
}
```

## HTTPError Properties

```typescript
class HTTPError extends BaseError {
    statusCode: number;              // HTTP status (100-599), defaults to 500
    statusMessage?: string;          // HTTP reason phrase
    redirectURL?: string;            // For redirect responses
}
```

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
3. Objects passing `checkFn` → merge all enumerable keys

The `ebec` package creates its extractor with `isOptions()`. The `@ebec/http` package creates its own with an extended `isOptions()` that also validates `statusCode`, `statusMessage`, and `redirectURL`.

## Code Generation (HTTP Package)

The http package generates 46 error classes from JSON config + Mustache template:

1. **Config**: `build/client.json` and `build/server.json` define `{ ClassName: { statusCode, statusMessage, code } }`
2. **Template**: `template/error.tpl` produces a class extending `ClientError` or `ServerError`
3. **Script**: `build/index.mjs` renders templates and writes to `src/errors/{client,server}/`
4. **Barrel exports**: Auto-generated `index.ts` files in each subdirectory

To add a new HTTP error: add an entry to the appropriate JSON file and run `npm run build:classes -w packages/http`.

## Type Guards

Each level provides a type guard for duck-type checking:

| Function | Package | Checks |
|----------|---------|--------|
| `isBaseError(x)` | ebec | Is object with valid Options shape + string message |
| `isHTTPError(x)` | @ebec/http | Is error with numeric statusCode 400-599 |
| `isClientError(x)` | @ebec/http | isHTTPError + statusCode 400-499 |
| `isServerError(x)` | @ebec/http | isHTTPError + statusCode 500-599 |

## Expose Convention

- **ClientError** (4xx): `expose: true` — message is safe to return to the client
- **ServerError** (5xx): `expose: false` — message should be hidden from end users
