import { markInstanceof } from '@ebec/core';
import { ServerError } from '../base';
import type { HTTPErrorInput, HTTPErrorOptions } from '../../types';

export const BAD_GATEWAY_ERROR_INSTANCE = Symbol.for('@ebec/http/BadGatewayError');

export const BadGatewayErrorOptions = {
    code: 'BAD_GATEWAY',
    status: 502,
} as const;

export class BadGatewayError extends ServerError {
    constructor(input: HTTPErrorInput = {}) {
        const options: HTTPErrorOptions = typeof input === 'string' ? { message: input } : input;
        super({
            ...options,
            code: options.code ?? BadGatewayErrorOptions.code,
            status: options.status ?? options.statusCode ?? BadGatewayErrorOptions.status,
        });
        markInstanceof(this, BAD_GATEWAY_ERROR_INSTANCE);
    }
}
