<p align="center">
    <img src="https://raw.githubusercontent.com/tada5hi/ebec/HEAD/packages/http/assets/logo.svg" alt="@ebec/http" />
</p>

<h1 align="center">@ebec/http</h1>

<p align="center">
    <b>HTTP error classes for TypeScript, extending <a href="https://www.npmjs.com/package/@ebec/core">@ebec/core</a> — 43 pre-built classes for the 4xx and 5xx status codes, with <code>@instanceof</code>-chain-based type guards.</b>
</p>

[![npm version](https://badge.fury.io/js/@ebec%2Fhttp.svg)](https://badge.fury.io/js/@ebec%2Fhttp)
[![main](https://github.com/tada5hi/ebec/actions/workflows/main.yml/badge.svg)](https://github.com/tada5hi/ebec/actions/workflows/main.yml)
[![codecov](https://codecov.io/gh/tada5hi/ebec/branch/master/graph/badge.svg?token=HLHCWI3VO1)](https://codecov.io/gh/tada5hi/ebec)

**Table of Contents**

- [Installation](#installation)
- [Quick Start](#quick-start)
- [Custom Subclasses](#custom-subclasses)
- [Type Guards](#type-guards)
- [Error Classes](#error-classes)
- [API Reference](#api-reference)
- [License](#license)

## Installation

```bash
npm install @ebec/http
```

This installs `@ebec/core` as a dependency automatically.

## Quick Start

```typescript
import { NotFoundError, InternalServerError } from '@ebec/http';

// String message
const error = new NotFoundError('user not found');
console.log(error.status);        // 404
console.log(error.code);          // "NOT_FOUND"
console.log(error.message);       // "user not found"

// Options input
const error = new InternalServerError({
    message: 'database connection lost',
    code: 'DB_CONN_LOST',
});
console.log(error.status); // 500
console.log(error.code);   // "DB_CONN_LOST"
```

Use in an Express-style error handler:

```typescript
import { isHTTPError } from '@ebec/http';

app.use((err, req, res, next) => {
    if (isHTTPError(err)) {
        res.status(err.status).json(err.toJSON());
    } else {
        res.status(500).json({ message: 'Internal Server Error' });
    }
});
```

## Custom Subclasses

Extend any error class with your own defaults:

```typescript
import { NotFoundError } from '@ebec/http';

class UserNotFoundError extends NotFoundError {
    constructor(userId: number) {
        super({
            message: `User ${userId} not found`,
            code: 'USER_NOT_FOUND',
        });
    }
}

throw new UserNotFoundError(42);
// status: 404, code: "USER_NOT_FOUND", message: "User 42 not found"
```

## Type Guards

Type guards check the `@instanceof` class-marker chain and return interface types (`IHTTPError`, `IClientError`, `IServerError`). Identity is chain-only — there is no duck-typing shape fallback. An object that merely has the right shape (a `status` field, a `code`, even one carried over from another HTTP error library) is not recognised; only errors that actually carry the `@ebec/http` marker chain are.

`isHTTPError` matches via `matchesInstanceof` — as a `Symbol.for(...)` marker on in-process instances, or as the string list that `toJSON()` emits under the `@instanceof` key — so the match survives a JSON round-trip. `isClientError` and `isServerError` are status-range refinements, not separate identity checks: each first matches its own chain marker (so a `NotFoundError` matches `isClientError` outright), and otherwise delegates identity to `isHTTPError` and decides by `status` range from there. That's why a bare `new HTTPError({ status: 404 })` — which never marks itself as a `ClientError` — still matches `isClientError`: it's a confirmed `HTTPError` by chain, refined by status.

```typescript
import {
    isHTTPError,
    isClientError,
    isServerError,
} from '@ebec/http';

if (isHTTPError(error)) {
    // error has status (400-599)
    console.log(error.status);
}

if (isClientError(error)) {
    // error has status 400-499
}

if (isServerError(error)) {
    // error has status 500-599
}
```

### Accessing Core Exports

Everything from `@ebec/core` is available via the `./core` subpath:

```typescript
import { BaseError, isBaseError } from '@ebec/http/core';
```

## Error Classes

### Base

| Class | Description |
|-------|-------------|
| `HTTPError` | Base HTTP error, extends `BaseError`. Defaults to status 500. |
| `ClientError` | Base for 4xx errors, extends `HTTPError`. |
| `ServerError` | Base for 5xx errors, extends `HTTPError`. |

### Client (4xx)

| Status | Class | Code |
|--------|-------|------|
| 400 | `BadRequestError` | `BAD_REQUEST` |
| 401 | `UnauthorizedError` | `UNAUTHORIZED` |
| 403 | `ForbiddenError` | `FORBIDDEN` |
| 404 | `NotFoundError` | `NOT_FOUND` |
| 405 | `MethodNotAllowedError` | `METHOD_NOT_ALLOWED` |
| 406 | `NotAcceptableError` | `NOT_ACCEPTABLE` |
| 407 | `ProxyAuthenticationRequiredError` | `PROXY_AUTHENTICATION_REQUIRED` |
| 408 | `RequestTimeoutError` | `REQUEST_TIMEOUT` |
| 409 | `ConflictError` | `CONFLICT` |
| 410 | `GoneError` | `GONE` |
| 411 | `LengthRequiredError` | `LENGTH_REQUIRED` |
| 412 | `PreconditionFailedError` | `PRECONDITION_FAILED` |
| 413 | `RequestEntityTooLargeError` | `REQUEST_ENTITY_TOO_LARGE` |
| 414 | `RequestURITooLongError` | `REQUEST_URI_TOO_LONG` |
| 415 | `UnsupportedMediaTypeError` | `UNSUPPORTED_MEDIA_TYPE` |
| 416 | `RequestedRangeNotSatisfiableError` | `REQUESTED_RANGE_NOT_SATISFIABLE` |
| 417 | `ExpectationFailedError` | `EXPECTATION_FAILED` |
| 418 | `ImATeapotError` | `IM_A_TEAPOT` |
| 420 | `EnhanceYourCalmError` | `ENHANCE_YOUR_CALM` |
| 422 | `UnprocessableEntityError` | `UNPROCESSABLE_ENTITY` |
| 423 | `LockedError` | `LOCKED` |
| 424 | `FailedDependencyError` | `FAILED_DEPENDENCY` |
| 425 | `UnorderedCollectionError` | `UNORDERED_COLLECTION` |
| 426 | `UpgradeRequiredError` | `UPGRADE_REQUIRED` |
| 428 | `PreconditionRequiredError` | `PRECONDITION_REQUIRED` |
| 429 | `TooManyRequestsError` | `TOO_MANY_REQUESTS` |
| 431 | `RequestHeaderFieldsTooLargeError` | `REQUEST_HEADER_FIELDS_TOO_LARGE` |
| 444 | `NoResponseError` | `NO_RESPONSE` |
| 449 | `RetryWithError` | `RETRY_WITH` |
| 450 | `BlockedByWindowsParentalControlsError` | `BLOCKED_BY_WINDOWS_PARENTAL_CONTROLS` |
| 499 | `ClientClosedRequestError` | `CLIENT_CLOSED_REQUEST` |

### Server (5xx)

| Status | Class | Code |
|--------|-------|------|
| 500 | `InternalServerError` | `INTERNAL_SERVER_ERROR` |
| 501 | `NotImplementedError` | `NOT_IMPLEMENTED` |
| 502 | `BadGatewayError` | `BAD_GATEWAY` |
| 503 | `ServiceUnavailableError` | `SERVICE_UNAVAILABLE` |
| 504 | `GatewayTimeoutError` | `GATEWAY_TIMEOUT` |
| 505 | `HTTPVersionNotSupportedError` | `HTTP_VERSION_NOT_SUPPORTED` |
| 506 | `VariantAlsoNegotiatesError` | `VARIANT_ALSO_NEGOTIATES` |
| 507 | `InsufficientStorageError` | `INSUFFICIENT_STORAGE` |
| 508 | `LoopDetectedError` | `LOOP_DETECTED` |
| 509 | `BandwidthLimitExceededError` | `BANDWIDTH_LIMIT_EXCEEDED` |
| 510 | `NotExtendedError` | `NOT_EXTENDED` |
| 511 | `NetworkAuthenticationRequiredError` | `NETWORK_AUTHENTICATION_REQUIRED` |

## API Reference

### HTTPError

```typescript
class HTTPError extends BaseError {
    readonly status: number;           // defaults to 500
    readonly redirectURL?: string;

    get statusCode(): number;          // @deprecated — alias for `status`

    constructor(input?: string | ErrorOptions);
}
```

### ErrorOptions

Extends core `ErrorOptions` with HTTP-specific fields:

| Property | Type | Description |
|----------|------|-------------|
| `status` | `number \| string` | HTTP status code (400-599). Invalid values default to 500. |
| `statusCode` | `number \| string` | **Deprecated.** Alias for `status`. |
| `redirectURL` | `string` | Redirect URL for 3xx-style responses. |

Plus all fields from [`@ebec/core` ErrorOptions](../core#erroroptions).

### Type Guards

| Function | Returns | Checks |
|----------|---------|--------|
| `isHTTPError(input)` | `input is IHTTPError` | Chain-only: true iff the `@instanceof` chain carries the `HTTPError` marker. No shape/status fallback |
| `isClientError(input)` | `input is IClientError` | Own chain marker match; otherwise delegates identity to `isHTTPError` (chain-confirmed) + status 400-499 |
| `isServerError(input)` | `input is IServerError` | Own chain marker match; otherwise delegates identity to `isHTTPError` (chain-confirmed) + status 500-599 |
| `isErrorOptions(input)` | `input is ErrorOptions` | Validates HTTP options shape |

### Utilities

| Function | Description |
|----------|-------------|
| `getStatusText(statusCode)` | Returns the reason phrase for a given status code, or `undefined` if not found |
| `sanitizeStatusCode(input)` | Parses and validates (400-599), defaults to 500 |
| `STATUS_TEXTS` | Map of status codes to reason phrases (e.g. `400 → "Bad Request"`) |

## License

Made with 💚

Published under [MIT License](./LICENSE).
