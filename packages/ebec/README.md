# ebec 🥋

[![npm version](https://badge.fury.io/js/ebec.svg)](https://badge.fury.io/js/ebec)
[![main](https://github.com/Tada5hi/ebec/actions/workflows/main.yml/badge.svg)](https://github.com/Tada5hi/ebec/actions/workflows/main.yml)
[![codecov](https://codecov.io/gh/tada5hi/ebec/branch/master/graph/badge.svg?token=HLHCWI3VO1)](https://codecov.io/gh/tada5hi/ebec)
[![codecov](https://codecov.io/gh/tada5hi/ebec/branch/master/graph/badge.svg?token=HLHCWI3VO1)](https://codecov.io/gh/tada5hi/ebec)

A library that provides a basic error class and helper functions for extracting options and the error message
from any number of constructor arguments.

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

### Simple
The `BaseError` class can be initialized on different ways, like demonstrated by the following examples:

**Example #1**

In this example no options are specified on class instantiation, but afterward.
```typescript
import { BaseError } from 'ebec';

const error = new BaseError('An error occurred.');

console.log(error.message);
// An error is occurred.
```

**Example #2**

In the following example only the error options are passed as single argument to the error constructor.

```typescript
import { BaseError, Options } from 'ebec';

const error = new BaseError({
    message: 'The entity could not be found',
    code: 'BAD_REQUEST'
});

console.log(error.message);
// The entity could not be found

// access the option values
console.log(error.code);
// BAD_REQUEST
```


### Inheritance

Besides, using only the BaseError class, own classes which inherit the BaseError class,
can simply be created and provide a better way to handle errors more differentiated.

```typescript
import {
    BaseError, 
    Options
} from 'ebec';

export class NotFoundError extends BaseError {
    constructor(message?: string) {
        super({
            logMessage: true,
            logLevel: 'warning',
            statusCode: 404,
            statusMessage: message || 'NotFound'
        });
    }

}
```

## Types

### Options

```typescript
export type Options = {
    /**
     * The error code is either a short uppercase string identifier 
     * for the error or a numeric error code. For example: SERVER_ERROR
     */
    code?: string | number,

    /**
     * The actual error message, if not provided on another way.
     */
    message?: string,

    /**
     * Mark this error as error which need to be logged.
     */
    logMessage?: boolean,

    /**
     * Set the log level for this error.
     */
    logLevel?: string | number,

    /**
     * Specify a previous error.
     */
    cause?: unknown,
}
```

## Utils

### isBaseError

This method is used to determine if the error is a basic error or if the error extends this class.

```typescript
import { isBaseError, BaseError } from "ebec";

const error = new BaseError();
isBaseError(error);
// true
```

## License

Made with 💚

Published under [MIT License](./LICENSE).
