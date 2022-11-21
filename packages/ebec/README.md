# ebec 🥋

[![npm version](https://badge.fury.io/js/ebec.svg)](https://badge.fury.io/js/ebec)
[![main](https://github.com/Tada5hi/ebec/actions/workflows/main.yml/badge.svg)](https://github.com/Tada5hi/ebec/actions/workflows/main.yml)
[![codecov](https://codecov.io/gh/tada5hi/ebec/branch/master/graph/badge.svg?token=HLHCWI3VO1)](https://codecov.io/gh/tada5hi/ebec)
[![codecov](https://codecov.io/gh/tada5hi/ebec/branch/master/graph/badge.svg?token=HLHCWI3VO1)](https://codecov.io/gh/tada5hi/ebec)

This is a library, which provides a base error class, which can simply be extended ⚡.
It also provides some utility functions to `build` & `merge` options. 

**Table of Contents**

- [Installation](#installation)
- [Usage](#usage)
    - [Simple](#simple)
    - [Inheritance](#inheritance)
    - [Utils](#utils)
- [Types](#types)
- [License](#license)

## Installation

```bash
npm install ebec --save
```

## Usage

### Simple
The `BaseError` class can be initialized on different ways, like demonstrated by the following examples:

**Example #1**

In this example no options are specified on class instantiation, but afterwards.
```typescript
import { BaseError } from 'ebec';

const error = new BaseError('An error occurred.');

console.log(error.message);
// An error is occurred.

console.log(error.getOptions());
// {}

error.setOption('statusCode', 404);

console.log(error.getOptions());
// {statusCode: 404}

console.log(error.getOption('statusCode'));
// 404
```

**Example #2**

In the following example the error options are specified on instantiation.

```typescript
import { BaseError, Options } from 'ebec';

const options : Options = {
    statusCode: 404,
    //... define some own options
    foo: 'bar'
}
const error = new BaseError('The entity could not be found', options);

const statusCode = error.getOption('statusCode');
console.log(statusCode);
// 404

const foo = error.getOption('foo');
console.log(foo);
// bar
```
Like demonstrated in the example above, self defined options can be provided in addition to 
the existing options keys ⚡.

**Example #3**

In the following example only the error options are passed as single argument to the error constructor.

```typescript
import { BaseError, Options } from 'ebec';

const options : Options = {
    message: 'The entity could not be found',
    statusCode: 404,
    //... define some own options
    foo: 'bar'
}
const error = new BaseError(options);

console.log(error.message);
// The entity could not be found

// access the option values
const statusCode = error.getOption('statusCode');
console.log(statusCode);
// 404
```


### Inheritance

Besides, using only the BaseError class, own classes which inherit the BaseError class,
can simply be created and provide a better way to handle errors more differentiated.

```typescript
import {
    BaseError, 
    Options,
    mergeOptions
} from 'ebec';

export class NotFoundError extends BaseError {
    constructor(message?: Options) {
        super(mergeOptions(
            {
                logMessage: true,
                logLevel: 'warning',
                statusCode: 404,   
            },
            ...(options ? options : {})
        ));
    }

}
```

### Utils

The library is like already mentioned also shipped with some utility functions, to make life easier.

#### buildOptions
The `buildOptions` method requires two arguments. The first one can either be a `string`, `Error` or a
value of type `Options`. The second argument one, on the other hand must be of type `Options`.

```typescript
import { buildOptions } from 'ebec';

let options = buildOptions({
    statusCode: 404
}, {
    error: 'ERROR'
});
console.log(options);
// {statusCode: 404, code: 'ERROR'}

options = buildOptions('An error occurred.', {code: 'ERROR'});
console.log(options);
// {code: 'ERROR'}
```

#### mergeOptions

The `mergeOptions` accepts 1-n arguments of type `Options` and merge them to one option set,
which is then provided as return value.

```typescript
import { mergeOptions } from 'ebec';

let options = mergeOptions({
    statusCode: 404
}, {
    error: 'ERROR'
});
console.log(options);
// {statusCode: 404, code: 'ERROR'}

options = mergeOptions('An error occurred.', {code: 'ERROR'});
console.log(options);
// {code: 'ERROR'}
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
     * Specify if the error message should be decorated for public view
     * or already provide a decoration message.
     */
    decorateMessage?: boolean | string,

    /**
     * Specify a previous error.
     */
    previous?: Error,

    /**
     * In case of a http error provide a numeric Status Code between 400-599.
     */
    statusCode?: number,

    /**
     * Specify a redirect URL in case of a http error.
     */
    redirectURL?: string,

    /**
     * Additional options.
     */
    [key: string]: any
}
```

## License

Made with 💚

Published under [MIT License](./LICENSE).
