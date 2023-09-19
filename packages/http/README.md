# @ebec/http 🥁

[![npm version](https://badge.fury.io/js/@ebec%2Fhttp.svg)](https://badge.fury.io/js/@ebec%2Fhttp)
[![main](https://github.com/Tada5hi/ebec/actions/workflows/main.yml/badge.svg)](https://github.com/Tada5hi/ebec/actions/workflows/main.yml)
[![codecov](https://codecov.io/gh/tada5hi/ebec/branch/master/graph/badge.svg?token=HLHCWI3VO1)](https://codecov.io/gh/tada5hi/ebec)
[![Conventional Commits](https://img.shields.io/badge/Conventional%20Commits-1.0.0-%23FE5196?logo=conventionalcommits&logoColor=white)](https://conventionalcommits.org)

A library that provides HTTP base error classes (`NotFoundError`, `InternalServerError`, ...).

**Table of Contents**

- [Installation](#installation)
- [Usage](#usage)
- [Types](#types)
  - [Client](#client)
  - [Server](#server)
- [License](#license)

## Installation

```bash
npm install @ebec/http --save
```

## Usage

The usage is pretty easy, just import one of the [client](#client) or [server](#server) error classes and use them
in `throw-` & `catch-` statements.

**Basic**
```typescript
import {
    InternalServerError,
    NotFoundError
} from "@ebec/http";

const clientError = new NotFoundError();

console.log(clientError.statusCode);
// 404

console.log(clientError.logMessage);
// false

console.log(clientError.code);
// NOT_FOUND

// ------------------------------------

const serverError = new InternalServerError({
    logLevel: 'warning'
});

console.log(clientError.statusCode);
// 500

console.log(clientError.logMessage);
// true

console.log(clientError.code);
// INTERNAL_SERVER_ERROR

console.log(clientError.logLevel);
// warning
```

Another way to use the predefined error classes is to extend them,
with own `options`.

**Extend**

```typescript
import {
    Options,
    mergeOptions,
    NotFoundError
} from "@ebec/http";

class UserNotFound extends NotFoundError {
    constructor() {
        super({
            statusMessage: 'The user was not found.',
            code: 'USER_NOT_FOUND'
        });
    }
}
```

## Types

The following HTTP classes are predefined:

### Client

- 400 `BadRequestError`
- 401 `UnauthorizedError`
- 403 `ForbiddenError`
- 404 `NotFoundError`
- 405 `MethodNotAllowedError`
- 406 `NotAcceptableError`
- 407 `ProxyAuthenticationRequiredError`
- 408 `RequesTimeoutError`
- 409 `ConflictError`
- 410 `GoneError`
- 411 `LengthRequiredError`
- 412 `PreconditionFailedError`
- 413 `RequestEntityTooLargeError`
- 414 `RequestUriTooLongError`
- 415 `UnsupportedMediaTypeError`
- 416 `RequestRangeNotSatisfiedError`
- 417 `ExpectationFailedError`
- 418 `ImATeapotError`
- 420 `EnhanceYourCalmError`
- 422 `UnprocessableEntityError`
- 423 `LockedError`
- 424 `FailedDependencyError`
- 424 `UnorderedCollectionError`
- 426 `UpgradeRequiredError`
- 428 `PreconditionRequiredError`
- 429 `TooManyRequestError`
- 431 `RequestHeaderFieldsTooLargeError`
- 444 `NoResponseError`
- 449 `RetryWithError`
- 450 `BlockedByWindowsParentError`
- 499 `ClientClosedRequestError`

### Server

- 500 `InternalServerError`
- 501 `NotImplementedError`
- 502 `BadGatewayError`
- 503 `ServiceUnavailableError`
- 504 `GatewayTimeoutError`
- 505 `HTTPVersionNotSupportedError`
- 506 `VariantAlsoNegotiates`
- 507 `InsufficientStorageError`
- 508 `LoopDetectedError`
- 509 `BandwidthLimitExceededError`
- 510 `NotExtendedError`
- 511 `NetworkAuthenticationRequiredError`

## License

Made with 💚

Published under [MIT License](./LICENSE).
