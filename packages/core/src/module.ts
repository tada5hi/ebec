/*
 * Copyright (c) 2026.
 *  Author Peter Placzek (tada5hi)
 *  For the full copyright and license information,
 *  view the LICENSE file that was distributed with this source code.
 */

import type { Issue } from './issue';
import type { ErrorInput, IBaseError } from './types';
import {
    INSTANCEOF_PROPERTY,
    interpolate,
    markInstanceof,
    sanitizeErrorCode,
    serializeInstanceofChain,
    toSerializable,
} from './helpers';
import { extractErrorOptions } from './options';

export const BASE_ERROR_INSTANCE = Symbol.for('@ebec/core/BaseError');

export class BaseError extends Error implements IBaseError {
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

    /**
     * Structured validation failures, as an issue tree.
     * Always an array — empty when the error carries none.
     */
    readonly issues: ReadonlyArray<Issue>;

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
            Error.captureStackTrace(this, this.constructor as new (...args: never[]) => unknown);
        }

        // override existing stack
        if (options.stack) {
            this.stack = options.stack;
        }

        this.code = options.code || sanitizeErrorCode(this.constructor.name);

        if (options.errors !== undefined) {
            this.errors = [...options.errors];
        }

        this.issues = options.issues ? [...options.issues] : [];

        markInstanceof(this, BASE_ERROR_INSTANCE);
    }

    /**
     * The class-marker chain rides along as a string list so the ancestor
     * information survives a JSON round-trip (symbols don't serialize) —
     * duck-type guards match rehydrated subclass errors through it via
     * `matchesInstanceof`.
     */
    toJSON(): {
        name: string;
        message: string;
        code: string;
        cause?: unknown;
        errors?: unknown[];
        issues?: Issue[];
        [INSTANCEOF_PROPERTY]: string[];
    } {
        return {
            name: this.name,
            message: this.message,
            code: this.code,
            ...(this.cause !== undefined && { cause: toSerializable(this.cause) }),
            ...(this.errors !== undefined && { errors: this.errors.map((e) => toSerializable(e)) }),
            ...(this.issues.length > 0 && { issues: [...this.issues] }),
            [INSTANCEOF_PROPERTY]: serializeInstanceofChain(this),
        };
    }
}
