import {
    BaseError,
    markInstanceof,
    matchesInstanceof,
} from '@ebec/core';
import type { HTTPErrorInput, HTTPErrorOptions } from '../../types';
import {
    getStatusText,
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

// Identity is chain-only, same as isBaseError: an input either carries the
// HTTPError marker or it doesn't. There is no shape/status fallback — an
// upstream error that merely carries a `status` field is no longer mirrored
// onto our own response as if it were an HTTPError.
export function isHTTPError(input: unknown): input is IHTTPError {
    return matchesInstanceof(input, HTTP_ERROR_INSTANCE);
}
