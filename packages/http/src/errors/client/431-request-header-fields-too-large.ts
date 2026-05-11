import { markInstanceof } from '@ebec/core';
import { ClientError } from '../base';
import type { HTTPErrorInput, HTTPErrorOptions } from '../../types';

export const REQUEST_HEADER_FIELDS_TOO_LARGE_ERROR_INSTANCE = Symbol.for('@ebec/http/RequestHeaderFieldsTooLargeError');

export const RequestHeaderFieldsTooLargeErrorOptions = {
    code: 'REQUEST_HEADER_FIELDS_TOO_LARGE',
    status: 431,
} as const;

export class RequestHeaderFieldsTooLargeError extends ClientError {
    constructor(input: HTTPErrorInput = {}) {
        const options: HTTPErrorOptions = typeof input === 'string' ? { message: input } : input;
        super({
            ...options,
            code: options.code ?? RequestHeaderFieldsTooLargeErrorOptions.code,
            status: options.status ?? options.statusCode ?? RequestHeaderFieldsTooLargeErrorOptions.status,
        });
        markInstanceof(this, REQUEST_HEADER_FIELDS_TOO_LARGE_ERROR_INSTANCE);
    }
}
