import { markInstanceof } from '@ebec/core';
import { ClientError } from '../base';
import type { HTTPErrorInput, HTTPErrorOptions } from '../../types';

export const CLIENT_CLOSED_REQUEST_ERROR_INSTANCE = Symbol.for('@ebec/http/ClientClosedRequestError');

export const ClientClosedRequestErrorOptions = {
    code: 'CLIENT_CLOSED_REQUEST',
    status: 499,
} as const;

export class ClientClosedRequestError extends ClientError {
    constructor(input: HTTPErrorInput = {}) {
        const options: HTTPErrorOptions = typeof input === 'string' ? { message: input } : input;
        super({
            ...options,
            code: options.code ?? ClientClosedRequestErrorOptions.code,
            status: options.status ?? options.statusCode ?? ClientClosedRequestErrorOptions.status,
        });
        markInstanceof(this, CLIENT_CLOSED_REQUEST_ERROR_INSTANCE);
    }
}
