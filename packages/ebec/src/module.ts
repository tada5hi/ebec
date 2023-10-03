import type { Input } from './types';
import {
    extractOptions,
    isOptions,
} from './utils';

export class BaseError extends Error {
    /**
     * A unique identifier for the error,
     * which can be a short uppercase string or a numeric code.
     */
    code?: string | number | null;

    /**
     * Additional data associated with the error. This property can hold
     * unstructured information or supplementary details that provide context
     * to the error.
     */
    data?: unknown;

    /**
     * Determines whether the error message can be safely exposed externally.
     */
    expose?: boolean;

    /**
     * Indicates whether the error should be logged in the application's logs.
     */
    logMessage?: boolean;

    /**
     * Specifies the log level at which this error should be recorded.
     */
    logLevel?: string | number;

    /**
     * Represents the underlying cause or source of the error.
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

        this.code = options.code;
        this.expose = options.expose;
        this.logMessage = options.logMessage;
        this.logLevel = options.logLevel;
        this.data = options.data;
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
