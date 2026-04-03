# @ebec/core 🧱

[![npm version](https://badge.fury.io/js/@ebec%2Fcore.svg)](https://badge.fury.io/js/@ebec%2Fcore)
[![main](https://github.com/tada5hi/ebec/actions/workflows/main.yml/badge.svg)](https://github.com/tada5hi/ebec/actions/workflows/main.yml)
[![codecov](https://codecov.io/gh/tada5hi/ebec/branch/master/graph/badge.svg?token=HLHCWI3VO1)](https://codecov.io/gh/tada5hi/ebec)

Core error class library for TypeScript. Provides `BaseError` with automatic code derivation, message interpolation, and JSON serialization. Zero runtime dependencies.

**Table of Contents**

- [Installation](#installation)
- [Quick Start](#quick-start)
- [Code Derivation](#code-derivation)
- [Message Interpolation](#message-interpolation)
- [Wrapping Errors](#wrapping-errors)
- [Serialization](#serialization)
- [Type Guards](#type-guards)
- [Error Grouping](#error-grouping)
- [Error Catalog](#error-catalog)
- [API Reference](#api-reference)
- [License](#license)

## Installation

```bash
npm install @ebec/core
```

## Quick Start

The constructor accepts a `string` or an `ErrorOptions` object:

```typescript
import { BaseError } from '@ebec/core';

// String message
const error = new BaseError('something went wrong');

// Options object
const error = new BaseError({
    message: 'something went wrong',
    code: 'SOMETHING_WRONG',
});

// No arguments — defaults to message "An error occurred"
const error = new BaseError();
```

## Code Derivation

When no `code` is provided, it is derived from the class name by converting PascalCase to CONSTANT_CASE:

```typescript
const error = new BaseError();
console.log(error.code);
// "BASE_ERROR"

class NotFoundError extends BaseError {}
const notFound = new NotFoundError();
console.log(notFound.code);
// "NOT_FOUND_ERROR"
```

An explicit code always takes priority:

```typescript
const error = new BaseError({ code: 'CUSTOM_CODE' });
console.log(error.code);
// "CUSTOM_CODE"
```

## Message Interpolation

Use `messageData` to fill `{placeholder}` tokens in the message. The data is used for interpolation only and is not stored on the error instance.

```typescript
const error = new BaseError({
    message: 'User {id} not found in {service}',
    messageData: { id: 42, service: 'auth' },
});

console.log(error.message);
// "User 42 not found in auth"
```

Missing keys are left as-is:

```typescript
const error = new BaseError({
    message: 'Missing {field}',
    messageData: { other: 'value' },
});

console.log(error.message);
// "Missing {field}"
```

## Wrapping Errors

Use the `cause` option to preserve the original error:

```typescript
try {
    await db.query('...');
} catch (err) {
    throw new BaseError({
        message: 'query failed',
        code: 'DB_ERROR',
        cause: err,
    });
}
```

## Serialization

`toJSON()` returns a plain object with `name`, `message`, `code`, and optionally `cause`. If `cause` is a `BaseError`, it is serialized recursively.

```typescript
const cause = new BaseError({ message: 'inner', code: 'INNER' });
const error = new BaseError({ message: 'outer', code: 'OUTER', cause });

console.log(JSON.stringify(error, null, 2));
// {
//   "name": "BaseError",
//   "message": "outer",
//   "code": "OUTER",
//   "cause": {
//     "name": "BaseError",
//     "message": "inner",
//     "code": "INNER"
//   }
// }
```

## Type Guards

```typescript
import { isBaseError, isErrorWithCode } from '@ebec/core';

// Check if any value is a BaseError-shaped object
if (isBaseError(error)) {
    console.log(error.code);
}

// Narrow by specific code
if (isErrorWithCode(error, 'NOT_FOUND')) {
    // error.code is narrowed to 'NOT_FOUND'
}

// Match against multiple codes
if (isErrorWithCode(error, ['NOT_FOUND', 'GONE'])) {
    // error.code is 'NOT_FOUND' | 'GONE'
}
```

## Error Grouping

Use the `errors` option to collect multiple errors into a single error:

```typescript
const errors = [
    new BaseError({ message: 'field "name" is required', code: 'VALIDATION' }),
    new BaseError({ message: 'field "email" is invalid', code: 'VALIDATION' }),
];

throw new BaseError({
    message: 'validation failed',
    errors,
});
```

Plain `Error` instances work too — no wrapping needed:

```typescript
const results = await Promise.allSettled([taskA(), taskB(), taskC()]);
const failures = results
    .filter((r) => r.status === 'rejected')
    .map((r) => r.reason);

if (failures.length > 0) {
    throw new BaseError({ message: 'batch operation failed', errors: failures });
}
```

Use `isBaseErrorGroup` to check if an error carries grouped errors:

```typescript
import { isBaseErrorGroup } from '@ebec/core';

if (isBaseErrorGroup(error)) {
    for (const child of error.errors) {
        console.log(child.message);
    }
}
```

`toJSON()` includes `errors` when present, serializing each child via its `toJSON()` method if available:

```typescript
const error = new BaseError({
    message: 'batch failed',
    errors: [
        new BaseError({ message: 'step 1', code: 'STEP_1' }),
        new Error('step 2'),
    ],
});

console.log(JSON.stringify(error, null, 2));
// {
//   "name": "BaseError",
//   "message": "batch failed",
//   "code": "BASE_ERROR",
//   "errors": [
//     { "name": "BaseError", "message": "step 1", "code": "STEP_1" },
//     { "message": "step 2" }
//   ]
// }
```

## Error Catalog

Define a centralized catalog of error factories with interpolation support:

```typescript
import { defineErrorCatalog } from '@ebec/core';

const errors = defineErrorCatalog({
    USER_NOT_FOUND: { message: 'User {id} not found' },
    INVALID_INPUT: { message: 'Invalid input: {reason}', code: 'VALIDATION_ERROR' },
});

// Create errors with interpolation data
throw errors.USER_NOT_FOUND({ id: 42 });
// ^ message: "User 42 not found", code: "USER_NOT_FOUND"

// Override via second argument
throw errors.INVALID_INPUT({ reason: 'email required' }, { code: 'MISSING_EMAIL' });
// ^ message: "Invalid input: email required", code: "MISSING_EMAIL"
```

When `code` is not specified in the catalog entry, the key name is used as the code.

## API Reference

### BaseError

```typescript
class BaseError extends Error {
    readonly code: string;
    readonly errors?: ReadonlyArray<Error>;
    cause?: unknown;

    constructor(input?: string | ErrorOptions);
    toJSON(): { name: string; message: string; code: string; cause?: unknown; errors?: unknown[] };
}
```

### ErrorOptions

| Property | Type | Description |
|----------|------|-------------|
| `message` | `string` | Error message. Defaults to `"An error occurred"`. |
| `code` | `string` | Error identifier. Derived from class name if not set. |
| `messageData` | `Record<string, unknown>` | Data for `{placeholder}` interpolation. Not stored. |
| `cause` | `unknown` | Underlying cause of the error. |
| `errors` | `Error[]` | Collection of errors for batch/group scenarios. |
| `stack` | `string` | Override the stack trace. |

### Type Guards

| Function | Returns | Description |
|----------|---------|-------------|
| `isBaseError(input)` | `input is IBaseError` | Checks for Error with string `code` |
| `isBaseErrorGroup(input)` | `input is IBaseErrorGroup` | Checks for `isBaseError` + `errors` array |
| `isErrorWithCode(input, code)` | `input is IBaseError & { code: C }` | Narrows code to specific value(s) |
| `isError(input)` | `input is Error` | Duck-type check for Error-shaped objects |
| `isErrorOptions(input)` | `input is ErrorOptions` | Validates options shape |

### Helpers

| Function | Description |
|----------|-------------|
| `sanitizeErrorCode(input)` | Converts PascalCase to CONSTANT_CASE |
| `extractErrorOptions(input)` | Normalizes `string \| ErrorOptions` to `ErrorOptions` |
| `defineErrorCatalog(definitions)` | Creates typed error factory functions |
| `toSerializable(input)` | Converts to JSON-safe form via `toJSON()` or `{ message }` fallback |

## License

Made with 💚

Published under [MIT License](./LICENSE).
