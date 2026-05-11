import { markInstanceof } from '@ebec/core';
import { ClientError } from '../base';
import type { HTTPErrorInput, HTTPErrorOptions } from '../../types';

export const REQUEST_ENTITY_TOO_LARGE_ERROR_INSTANCE = Symbol.for('@ebec/http/RequestEntityTooLargeError');

export const RequestEntityTooLargeErrorOptions = {
    code: 'REQUEST_ENTITY_TOO_LARGE',
    status: 413,
} as const;

export class RequestEntityTooLargeError extends ClientError {
    constructor(input: HTTPErrorInput = {}) {
        const options: HTTPErrorOptions = typeof input === 'string' ? { message: input } : input;
        super({
            ...options,
            code: options.code ?? RequestEntityTooLargeErrorOptions.code,
            status: options.status ?? options.statusCode ?? RequestEntityTooLargeErrorOptions.status,
        });
        markInstanceof(this, REQUEST_ENTITY_TOO_LARGE_ERROR_INSTANCE);
    }
}
