import { ServerError } from '../base';
import type { HTTPErrorInput, HTTPErrorOptions } from '../../types';

export const GatewayTimeoutErrorOptions = {
    code: 'GATEWAY_TIMEOUT',
    statusCode: 504,
    statusMessage: 'Gateway Timeout',
} as const;

export class GatewayTimeoutError extends ServerError {
    constructor(input: HTTPErrorInput = {}) {
        const options: HTTPErrorOptions = typeof input === 'string' ? { message: input } : input;
        super({
            ...options,
            code: options.code ?? GatewayTimeoutErrorOptions.code,
            statusCode: options.statusCode ?? GatewayTimeoutErrorOptions.statusCode,
            statusMessage: options.statusMessage ?? GatewayTimeoutErrorOptions.statusMessage,
        });
    }
}
