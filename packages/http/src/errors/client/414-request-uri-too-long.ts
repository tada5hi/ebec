import { markInstanceof } from '@ebec/core';
import { ClientError } from '../base';
import type { HTTPErrorInput, HTTPErrorOptions } from '../../types';

export const REQUEST_URI_TOO_LONG_ERROR_INSTANCE = Symbol.for('@ebec/http/RequestURITooLongError');

export const RequestURITooLongErrorOptions = {
    code: 'REQUEST_URI_TOO_LONG',
    status: 414,
} as const;

export class RequestURITooLongError extends ClientError {
    constructor(input: HTTPErrorInput = {}) {
        const options: HTTPErrorOptions = typeof input === 'string' ? { message: input } : input;
        super({
            ...options,
            code: options.code ?? RequestURITooLongErrorOptions.code,
            status: options.status ?? options.statusCode ?? RequestURITooLongErrorOptions.status,
        });
        markInstanceof(this, REQUEST_URI_TOO_LONG_ERROR_INSTANCE);
    }
}
