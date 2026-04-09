import { BaseError, isBaseError } from '@ebec/core';
import type { HTTPErrorInput, HTTPErrorOptions } from '../../types';
import {
    getStatusText,
    isHTTPErrorOptions,
    sanitizeStatusCode,
} from '../../utils';
import type { IHTTPError } from './types';

export class HTTPError extends BaseError implements IHTTPError {
    /**
     * A numeric Status Code between 400-599.
     */
    readonly status: number;

    /**
     * Specify a redirect URL in case of a http error.
     */
    readonly redirectURL?: string;

    private _statusMessage: string | undefined | null = null;

    constructor(input: HTTPErrorInput = {}) {
        const options: HTTPErrorOptions = typeof input === 'string' ? { message: input } : input;
        const statusCode = options.status ?? options.statusCode;
        const statusCodeNormalized = statusCode ?
            sanitizeStatusCode(statusCode) :
            500;

        super({
            ...options,
            message: options.message || getStatusText(statusCodeNormalized),
        });

        this.status = statusCodeNormalized;

        this.redirectURL = options.redirectURL;
    }

    /**
     * The HTTP reason phrase derived from the status code.
     */
    get statusMessage(): string | undefined {
        if (this._statusMessage === null) {
            this._statusMessage = getStatusText(this.status);
        }

        return this._statusMessage;
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
            statusMessage: this.statusMessage,
        };
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
