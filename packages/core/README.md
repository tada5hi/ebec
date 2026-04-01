# ebec 🥋

[![npm version](https://badge.fury.io/js/ebec.svg)](https://badge.fury.io/js/ebec)
[![main](https://github.com/Tada5hi/ebec/actions/workflows/main.yml/badge.svg)](https://github.com/Tada5hi/ebec/actions/workflows/main.yml)
[![codecov](https://codecov.io/gh/tada5hi/ebec/branch/master/graph/badge.svg?token=HLHCWI3VO1)](https://codecov.io/gh/tada5hi/ebec)
[![codecov](https://codecov.io/gh/tada5hi/ebec/branch/master/graph/badge.svg?token=HLHCWI3VO1)](https://codecov.io/gh/tada5hi/ebec)

A library that simplifies error handling by providing an ES6 error class and utility functions.
This library facilitates the extraction of options and error messages from constructor arguments.

**Table of Contents**

- [Installation](#installation)
- [Usage](#usage)
    - [Simple](#simple)
    - [Inheritance](#inheritance)
- [Types](#types)
- [Utils](#utils)
- [License](#license)

## Installation

```bash
npm install ebec --save
```

## Usage

The **BaseError** class accepts various constructor arguments of type [Input](#input) and any
[Options](#options) specified during initialization are automatically assigned as attributes.

### Simple

Create error instances in different ways, as demonstrated in the following examples:

**Example #1**

```typescript
import { BaseError } from 'ebec';

const error = new BaseError('An error occurred.');

console.log(error.message);
// An error occurred.
```

**Example #2**

In this example, only error options are passed as a single argument to the error constructor.

```typescript
import { BaseError } from 'ebec';

const error = new BaseError({
    message: 'The entity could not be found',
    code: 'BAD_REQUEST'
});

console.log(error.message);
// The entity could not be found

console.log(error.code);
// BAD_REQUEST
```

**Example #3**

In this example, multiple arguments are passed to the error constructor.

```typescript
import { BaseError } from 'ebec';

const cause = new Error('foo');

const error = new BaseError(
    'The entity could not be found',
    {
        code: 'BAD_REQUEST'
    },
    cause
);

console.log(error.message);
// The entity could not be found

console.log(error.code);
// BAD_REQUEST

console.log(error.cause);
// { message: 'foo', ... }
```

### Inheritance

Custom error classes that inherit from BaseError allow for more specific error handling.

```typescript
import {
    BaseError, 
    Options
} from 'ebec';

export class NotFoundError extends BaseError {
    constructor(message?: string) {
        super({
            message,
            logMessage: true,
            logLevel: 'warning',
            code: 'NOT_FOUND'
        });
    }

}
```

## Types

### Input

```typescript
type Input = Options | Error | string;
```

### Options

```typescript
type Options = {
    /**
     * The actual error message, if not provided on another way.
     */
    message?: string,

    /**
     * Trace of which functions were called.
     */
    stack?: string

    /**
     * A unique identifier for the error,
     * which can be a short uppercase string or a numeric code.
     */
    code?: string | number | null,

    /**
     * Additional data associated with the error. This property can hold
     * unstructured information or supplementary details that provide context
     * to the error.
     */
    data?: unknown,

    /**
     * Determines whether the error message can be safely exposed externally.
     */
    expose?: boolean;

    /**
     * Indicates whether the error should be logged in the application's logs.
     */
    logMessage?: boolean,

    /**
     * Specifies the log level at which this error should be recorded.
     */
    logLevel?: string | number,

    /**
     * Represents the underlying cause or source of the error.
     */
    cause?: unknown
};
```

## Utils

### isBaseError

This method is used to determine if the error is a basic error or if the error extends this class.

```typescript
import { isBaseError, BaseError } from "ebec";

const error = new BaseError();

console.log(isBaseError(error));
// true
```

## License

Made with 💚

Published under [MIT License](./LICENSE).
