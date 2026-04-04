import { BaseError, isBaseError } from '@ebec/core';
import type { HTTPErrorInput, HTTPErrorOptions } from '../../types';
import {
    isHTTPErrorOptions,
    sanitizeStatusCode,
    sanitizeStatusMessage,
} from '../../utils';
import type { IHTTPError } from './types';

export class HTTPError extends BaseError {
    /**
     * A numeric Status Code between 400-599.
     */
    readonly statusCode: number;

    /**
     * A status message.
     */
    readonly statusMessage?: string;

    /**
     * Specify a redirect URL in case of a http error.
     */
    readonly redirectURL?: string;

    constructor(input: HTTPErrorInput = {}) {
        const options: HTTPErrorOptions = typeof input === 'string' ? { message: input } : input;

        super(options);

        this.statusCode = options.statusCode ?
            sanitizeStatusCode(options.statusCode) :
            500;

        this.statusMessage = options.statusMessage ?
            sanitizeStatusMessage(options.statusMessage) :
            undefined;

        this.redirectURL = options.redirectURL;
    }
}

export function isHTTPError(input: unknown): input is IHTTPError {
    if (!isHTTPErrorOptions(input)) {
        return false;
    }

    if (
        typeof input.statusCode !== 'number' ||
        input.statusCode < 400 ||
        input.statusCode >= 600
    ) {
        return false;
    }

    return isBaseError(input);
}
