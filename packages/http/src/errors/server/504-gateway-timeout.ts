import { ServerError } from '../base';
import type { HTTPErrorInput, HTTPErrorOptions } from '../../types';

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
    }
}
