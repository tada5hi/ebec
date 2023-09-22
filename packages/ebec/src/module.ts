import type { Input } from './types';
import {
    extractMessage,
    extractOptions,
    hasOwnProperty,
    isError,
    isErrorCode,
    isErrorExpose,
    isErrorLogLevel,
    isErrorLogMessage,
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
        const message = extractMessage(...input);

        super(message, { cause: options.cause });

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

        /* istanbul ignore next */
        if (typeof this.stack === 'undefined' || this.stack.length === 0) {
            this.stack = new Error(message).stack;
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
    if (!isError(input)) {
        return false;
    }

    if (
        hasOwnProperty(input, 'code') &&
        typeof input.code !== 'undefined' &&
        !isErrorCode(input.code)
    ) {
        return false;
    }

    if (
        hasOwnProperty(input, 'expose') &&
        typeof input.expose !== 'undefined' &&
        !isErrorExpose(input.expose)
    ) {
        return false;
    }

    if (
        hasOwnProperty(input, 'logMessage') &&
        typeof input.logMessage !== 'undefined' &&
        !isErrorLogMessage(input.logMessage)
    ) {
        return false;
    }

    return !hasOwnProperty(input, 'logLevel') ||
        typeof input.logLevel === 'undefined' ||
        isErrorLogLevel(input.logLevel);
}
