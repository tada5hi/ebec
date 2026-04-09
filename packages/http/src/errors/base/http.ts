import { BaseError, isBaseError } from '@ebec/core';
import type { HTTPErrorInput, HTTPErrorOptions } from '../../types';
import {
    isHTTPErrorOptions,
    sanitizeStatusCode,
    sanitizeStatusMessage,
} from '../../utils';
import type { IHTTPError } from './types';

export class HTTPError extends BaseError implements IHTTPError {
    /**
     * A numeric Status Code between 400-599.
     */
    readonly status: number;

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

        const statusCode = options.status ?? options.statusCode;
        this.status = statusCode ?
            sanitizeStatusCode(statusCode) :
            500;

        this.statusMessage = options.statusMessage ?
            sanitizeStatusMessage(options.statusMessage) :
            undefined;

        this.redirectURL = options.redirectURL;
    }

    /**
     * @deprecated Use `status` instead.
     */
    get statusCode(): number {
        return this.status;
    }
}

export function isHTTPError(input: unknown): input is IHTTPError {
    if (!isHTTPErrorOptions(input)) {
        return false;
    }

    const status = (input as Record<string, unknown>).status ?? (input as Record<string, unknown>).statusCode;
    if (
        typeof status !== 'number' ||
        status < 400 ||
        status >= 600
    ) {
        return false;
    }

    return isBaseError(input);
}
