/*
 * Copyright (c) 2026.
 *  Author Peter Placzek (tada5hi)
 *  For the full copyright and license information,
 *  view the LICENSE file that was distributed with this source code.
 */

import type { ErrorInput, ObjectLiteral } from './types';
import {
    extractOptions,
} from './options';

export class BaseError extends Error {
    /**
     * A unique identifier for the error,
     * which can be a short uppercase string or a numeric code.
     */
    readonly code?: string | number | null;

    /**
     * Additional data associated with the error. This property can hold
     * unstructured information or supplementary details that provide context
     * to the error.
     */
    readonly data?: ObjectLiteral;

    /**
     * Determines whether the error message can be safely exposed externally.
     */
    readonly expose?: boolean;

    /**
     * Indicates whether the error should be logged in the application's logs.
     */
    readonly logMessage?: boolean;

    /**
     * Specifies the log level at which this error should be recorded.
     */
    readonly logLevel?: string | number;

    /**
     * Represents the underlying cause or source of the error.
     */
    override cause?: unknown;

    //--------------------------------------------------------------------

    constructor(...input: ErrorInput[]) {
        const options = extractOptions(...input);

        super(options.message, { cause: options.cause });

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

        this.code = options.code;
        this.expose = options.expose;
        this.logMessage = options.logMessage;
        this.logLevel = options.logLevel;
        this.data = options.data;
    }
}
