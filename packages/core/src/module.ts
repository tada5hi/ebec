/*
 * Copyright (c) 2026.
 *  Author Peter Placzek (tada5hi)
 *  For the full copyright and license information,
 *  view the LICENSE file that was distributed with this source code.
 */

import type { ErrorInput } from './types';
import { interpolate, sanitizeErrorCode, toSerializable } from './helpers';
import { extractErrorOptions } from './options';

export class BaseError extends Error {
    /**
     * A unique identifier for the error.
     */
    readonly code: string;

    /**
     * Represents the underlying cause or source of the error.
     */
    override cause?: unknown;

    /**
     * A collection of errors for batch/group error scenarios.
     */
    readonly errors?: ReadonlyArray<Error>;

    //--------------------------------------------------------------------

    constructor(input: ErrorInput = {}) {
        const options = extractErrorOptions(input);

        let message = options.message || 'An error occurred';
        if (options.messageData) {
            message = interpolate(message, options.messageData);
        }

        super(message);

        if (options.cause !== undefined) {
            this.cause = options.cause;
        }

        if (typeof this.name === 'undefined' || this.name === 'Error') {
            Object.defineProperty(this, 'name', {
                configurable: true,
                enumerable: false,
                value: this.constructor.name,
                writable: true,
            });
        }

        if (Error.captureStackTrace) {
            Error.captureStackTrace(this, this.constructor);
        }

        // override existing stack
        if (options.stack) {
            this.stack = options.stack;
        }

        this.code = options.code || sanitizeErrorCode(this.constructor.name);

        if (options.errors !== undefined) {
            this.errors = [...options.errors];
        }
    }

    toJSON(): {
        name: string;
        message: string;
        code: string;
        cause?: unknown;
        errors?: unknown[];
    } {
        return {
            name: this.name,
            message: this.message,
            code: this.code,
            ...(this.cause !== undefined && { cause: toSerializable(this.cause) }),
            ...(this.errors !== undefined && { errors: this.errors.map((e) => toSerializable(e)) }),
        };
    }
}
