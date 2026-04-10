# ebec 💥

[![main](https://github.com/tada5hi/ebec/actions/workflows/main.yml/badge.svg)](https://github.com/tada5hi/ebec/actions/workflows/main.yml)
[![codecov](https://codecov.io/gh/tada5hi/ebec/branch/master/graph/badge.svg?token=HLHCWI3VO1)](https://codecov.io/gh/tada5hi/ebec)
[![Known Vulnerabilities](https://snyk.io/test/github/tada5hi/ebec/badge.svg)](https://snyk.io/test/github/tada5hi/ebec)
[![Conventional Commits](https://img.shields.io/badge/Conventional%20Commits-1.0.0-%23FE5196?logo=conventionalcommits&logoColor=white)](https://conventionalcommits.org)

A collection of extensible, type-safe error classes for TypeScript.

Every error gets a `code` (derived automatically from the class name if you don't set one), an optional `cause` for wrapping, optional `errors` for grouping multiple failures, and a `toJSON()` that serializes the full chain. No decorators, no reflection — just plain classes you can extend, catch, and serialize.

**Table of Contents**

- [Packages](#packages)
- [Contributing](#contributing)
- [License](#license)

## Packages

### `@ebec/core`

[![npm version](https://badge.fury.io/js/@ebec%2Fcore.svg)](https://badge.fury.io/js/@ebec%2Fcore)

Base error class with automatic code derivation, message interpolation, error catalogs, and JSON serialization. Zero runtime dependencies.

```bash
npm install @ebec/core
```

```typescript
import { BaseError } from '@ebec/core';

// Simple string message
throw new BaseError('something failed');
// ^ code: "BASE_ERROR" (derived from class name)

// Options with message interpolation
throw new BaseError({
    message: 'User {id} not found',
    messageData: { id: 42 },
    code: 'USER_NOT_FOUND',
});
// ^ message: "User 42 not found", code: "USER_NOT_FOUND"

// Extend for your domain — code is derived automatically
class PaymentError extends BaseError {}
throw new PaymentError('card declined');
// ^ code: "PAYMENT_ERROR"

// Group multiple errors
throw new BaseError({
    message: 'validation failed',
    errors: [new Error('field required'), new Error('invalid format')],
});
```

[Full documentation](./packages/core/README.md)

### `@ebec/http`

[![npm version](https://badge.fury.io/js/@ebec%2Fhttp.svg)](https://badge.fury.io/js/@ebec%2Fhttp)

43 pre-built HTTP error classes (4xx/5xx) extending `@ebec/core` with status codes, status messages, and duck-typed type guards.

```bash
npm install @ebec/http
```

```typescript
import { NotFoundError, isClientError } from '@ebec/http';

const error = new NotFoundError('resource not found');
// ^ status: 404, code: "NOT_FOUND", message: "resource not found"

if (isClientError(error)) {
    res.status(error.status).json(error.toJSON());
}
```

[Full documentation](./packages/http/README.md)

## Contributing

```bash
npm ci
npm run build
npm run test
npm run lint
```

## License

Made with 💚

Published under [MIT License](./LICENSE).
