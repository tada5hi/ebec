<p align="center">
    <img src="https://raw.githubusercontent.com/tada5hi/ebec/HEAD/packages/core/assets/logo.svg" alt="@ebec/core" />
</p>

<h1 align="center">@ebec/core</h1>

<p align="center">
    <b>Core error class library for TypeScript — <code>BaseError</code> with automatic code derivation, message interpolation, and JSON serialization. Zero runtime dependencies.</b>
</p>

[![npm version](https://badge.fury.io/js/@ebec%2Fcore.svg)](https://badge.fury.io/js/@ebec%2Fcore)
[![main](https://github.com/tada5hi/ebec/actions/workflows/main.yml/badge.svg)](https://github.com/tada5hi/ebec/actions/workflows/main.yml)
[![codecov](https://codecov.io/gh/tada5hi/ebec/branch/master/graph/badge.svg?token=HLHCWI3VO1)](https://codecov.io/gh/tada5hi/ebec)

**Table of Contents**

- [Installation](#installation)
- [Quick Start](#quick-start)
- [Code Derivation](#code-derivation)
- [Message Interpolation](#message-interpolation)
- [Wrapping Errors](#wrapping-errors)
- [Serialization](#serialization)
- [Type Guards](#type-guards)
- [Error Grouping](#error-grouping)
- [Validation Issues](#validation-issues)
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

`toJSON()` returns a plain object with `name`, `message`, `code`, and optionally `cause`, `errors`, and `issues`. If `cause` is a `BaseError`, it is serialized recursively.

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
//     "code": "INNER",
//     "@instanceof": ["@ebec/core/BaseError"]
//   },
//   "@instanceof": ["@ebec/core/BaseError"]
// }
```

The `@instanceof` key carries the class-marker chain — one `Symbol.for(...)` registry key per class in the inheritance path — as a string list, since symbols don't survive `JSON.stringify`. Use `matchesInstanceof` to match a marker against both the in-process symbol chain and the rehydrated string chain:

```typescript
import { BASE_ERROR_INSTANCE, matchesInstanceof } from '@ebec/core';

const rehydrated = JSON.parse(JSON.stringify(new BaseError('boom')));

matchesInstanceof(rehydrated, BASE_ERROR_INSTANCE); // true
```

## Type Guards

Identity is chain-only: `isBaseError` (and every other type guard in this library) checks the `@instanceof` marker chain, not the input's shape. An object that merely *looks* like a `BaseError` — including an error from another library that happens to carry a `code` — does not match. Only errors produced by `@ebec/core` (or explicitly marked via `markInstanceof`) carry the chain, in-process and through `toJSON()`.

```typescript
import { isBaseError, isErrorWithCode } from '@ebec/core';

// Check if any value is a BaseError, by its @instanceof chain
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

Use `isBaseErrorGroup` to check if an error carries grouped errors. A present but empty `errors: []` does not count as a group — the array must be non-empty:

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
//     { "name": "BaseError", "message": "step 1", "code": "STEP_1", "@instanceof": ["@ebec/core/BaseError"] },
//     { "message": "step 2" }
//   ],
//   "@instanceof": ["@ebec/core/BaseError"]
// }
```

## Validation Issues

Use the `issues` option to attach structured validation failures, as an issue tree: every issue is either a leaf **item** or a **group** with children, and every node carries its absolute `path` from the root of the validated structure. The model is exported from the package root, so `defineIssueItem`, `flattenIssueItems`, `formatIssue`, `IssueCode` and the `Issue` types all come from `@ebec/core` directly.

```typescript
import { BaseError, IssueCode, defineIssueItem } from '@ebec/core';

throw new BaseError({
    message: 'validation failed',
    code: 'VALIDATION',
    issues: [
        defineIssueItem({
            code: IssueCode.REQUIRED,
            path: ['user', 'name'],
            message: 'Name is required',
        }),
    ],
});
```

`issues` is always an array — it defaults to `[]`, so `error.issues.length` is safe on every error without a guard.

The tree is stored as given. Group nodes keep their children rather than being flattened, so a consumer decides for itself whether the grouping matters:

```typescript
import { flattenIssueItems } from '@ebec/core';

const byField = Object.fromEntries(
    flattenIssueItems(error.issues).map((item) => [item.path.join('.'), item.message]),
);
```

`toJSON()` includes `issues` only when the array is non-empty, so an error that carries none does not ship a dead key. This is lossless: the omitted key rehydrates to `[]` through the constructor default. Note that `toJSON()` copies the issues array but not its elements, so the returned issue objects are live references and must not be mutated.

```typescript
console.log(JSON.stringify(error, null, 2));
// {
//   "name": "BaseError",
//   "message": "validation failed",
//   "code": "VALIDATION",
//   "issues": [
//     { "type": "item", "code": "required", "path": ["user", "name"], "message": "Name is required" }
//   ],
//   "@instanceof": ["@ebec/core/BaseError"]
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
    readonly issues: ReadonlyArray<Issue>;
    cause?: unknown;

    constructor(input?: string | ErrorOptions);
    toJSON(): { name: string; message: string; code: string; cause?: unknown; errors?: unknown[]; issues?: readonly Issue[]; '@instanceof': string[] };
}
```

### ErrorOptions

| Property | Type | Description |
|----------|------|-------------|
| `message` | `string` | Error message. Defaults to `"An error occurred"`. |
| `code` | `string` | Error identifier. Derived from class name if not set. |
| `messageData` | `Record<string, unknown>` | Data for `{placeholder}` interpolation. Not stored. |
| `cause` | `unknown` | Underlying cause of the error. |
| `errors` | `readonly Error[]` | Collection of errors for batch/group scenarios. |
| `issues` | `readonly Issue[]` | Structured validation failures, as an issue tree. |
| `stack` | `string` | Override the stack trace. |

### Type Guards

| Function | Returns | Description |
|----------|---------|-------------|
| `isBaseError(input)` | `input is IBaseError` | Chain-only: true iff the `@instanceof` chain carries the `BaseError` marker. No shape fallback — a merely Error-shaped object with a `code` no longer matches |
| `isBaseErrorGroup(input)` | `input is IBaseErrorGroup` | `isBaseError` + non-empty `errors` array |
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
| `markInstanceof(target, marker)` | Appends a `Symbol.for(...)` class marker to the target's `@instanceof` chain |
| `hasInstanceof(input, marker)` | Checks the chain for the marker symbol (strict, in-process form only) |
| `matchesInstanceof(input, marker)` | Checks the chain for the marker symbol **or** its description string (JSON-rehydrated form) |
| `serializeInstanceofChain(input)` | Serializes the chain to its string form, as emitted by `toJSON()` |

### Issue Model

| Function | Description |
|----------|-------------|
| `defineIssueItem(input)` | Build a leaf issue. The supplied `code` selects the required `data` shape at compile time. |
| `defineIssueGroup(input)` | Build an issue with children. Does not rewrite child paths — that is `prefixIssuePath`'s job. |
| `prefixIssuePath(issue, prefix)` | Rebase an issue onto a parent path, recursing into groups. Returns copies. |
| `flattenIssueItems(issues)` | Every leaf, pre-order, grouping discarded. Returns live references. |
| `flattenIssueGroups(issues)` | Every group, pre-order, outermost first. Returns live references. |
| `formatIssue(issue, templates?, fallback?)` | Render a message: template → eager `message` → fallback. |
| `isIssueItem(input)` | Structural check for a leaf. |
| `isIssueGroup(input)` | Structural check for an issue with children; recurses. |
| `isIssue(input)` | Either of the above. |

Types: `Issue`, `IssueItem`, `IssueGroup`, `IssueBase`, `IssueItemTyped`, `IssueItemBare`, `IssueItemRaw`, `IssueCode`, `IssueDataByCode`, `ParameterizedIssueCode`, `BareIssueCode`, `IssueMessageTemplates`, `ResolveIssueCode`, `DefineIssueItemData`, `DefineIssueItemReturn`.

`IssueCode` is a default vocabulary rather than a requirement — `IssueItem['code']` is widened to `IssueCode | (string & {})`, so any string is a well-formed code. `IssueDataByCode` is augmentable via `declare module '@ebec/core'` to add typed `data` shapes for your own codes.

## License

Made with 💚

Published under [MIT License](./LICENSE).
