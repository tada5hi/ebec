import {
    BaseError,
    hasInstanceof,
    isBaseError,
    markInstanceof,
} from '@ebec/core';
import type { HTTPErrorInput, HTTPErrorOptions } from '../../types';
import {
    getStatusText,
    isHTTPErrorOptions,
    sanitizeStatusCode,
} from '../../utils';
import type { IHTTPError } from './types';

export const HTTP_ERROR_INSTANCE = Symbol.for('@ebec/http/HTTPError');

export class HTTPError extends BaseError implements IHTTPError {
    /**
     * A numeric Status Code between 400-599.
     */
    readonly status: number;

    /**
     * Specify a redirect URL in case of a http error.
     */
    readonly redirectURL?: string;

    constructor(input: HTTPErrorInput = {}) {
        const options: HTTPErrorOptions = typeof input === 'string' ? { message: input } : input;
        const statusCodeNormalized = sanitizeStatusCode(options.status ?? options.statusCode);

        super({
            ...options,
            message: options.message || getStatusText(statusCodeNormalized),
        });

        this.status = statusCodeNormalized;

        this.redirectURL = options.redirectURL;

        markInstanceof(this, HTTP_ERROR_INSTANCE);
    }

    /**
     * @deprecated Use `status` instead.
     */
    get statusCode(): number {
        return this.status;
    }

    override toJSON() {
        return {
            ...super.toJSON(),
            status: this.status,
        };
    }
}

export function isHTTPError(input: unknown): input is IHTTPError {
    if (hasInstanceof(input, HTTP_ERROR_INSTANCE)) {
        return true;
    }

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
