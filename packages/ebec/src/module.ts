import type { Input } from './types';
import {
    extractOptions,
    isOptions,
} from './utils';

export class BaseError extends Error {
    /**
     * The error code is either a short uppercase string identifier
     * for the error or a numeric error code. For example: SERVER_ERROR
     */
    code?: string | number | null;

    /**
     * Can the error message be exposed externally without hesitation
     * or is it restricted for internal use?
     */
    expose?: boolean;

    /**
     * Should the error be logged?
     */
    logMessage?: boolean;

    /**
     * Set the log level for this error.
     */
    logLevel?: string | number;

    /**
     * A cause for the error.
     */
    override cause?: unknown;

    //--------------------------------------------------------------------

    constructor(...input: Input[]) {
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

        /* istanbul ignore next */
        if (
            typeof this.stack === 'undefined' ||
            this.stack.length === 0
        ) {
            this.stack = new Error(options.message).stack;
        }

        this.code = options.code;
        this.expose = options.expose;
        this.logMessage = options.logMessage;
        this.logLevel = options.logLevel;
    }
}

export function isBaseError(
    input: unknown,
): input is BaseError {
    if (!isOptions(input)) {
        return false;
    }

    return typeof input.message === 'string';
}
