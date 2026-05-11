import { markInstanceof } from '@ebec/core';
import { ServerError } from '../base';
import type { HTTPErrorInput, HTTPErrorOptions } from '../../types';

export const GATEWAY_TIMEOUT_ERROR_INSTANCE = Symbol.for('@ebec/http/GatewayTimeoutError');

export const GatewayTimeoutErrorOptions = {
    code: 'GATEWAY_TIMEOUT',
    status: 504,
} as const;

export class GatewayTimeoutError extends ServerError {
    constructor(input: HTTPErrorInput = {}) {
        const options: HTTPErrorOptions = typeof input === 'string' ? { message: input } : input;
        super({
            ...options,
            code: options.code ?? GatewayTimeoutErrorOptions.code,
            status: options.status ?? options.statusCode ?? GatewayTimeoutErrorOptions.status,
        });
        markInstanceof(this, GATEWAY_TIMEOUT_ERROR_INSTANCE);
    }
}
