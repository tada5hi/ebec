import { ServerError } from '../base';
import type { ErrorInput, ErrorOptions } from '../../types';

export const GatewayTimeoutErrorOptions = {
    code: 'GATEWAY_TIMEOUT',
    statusCode: 504,
    statusMessage: 'Gateway Timeout',
} as const;

export class GatewayTimeoutError extends ServerError {
    constructor(input: ErrorInput = {}) {
        const options: ErrorOptions = typeof input === 'string' ? { message: input } : input;
        super({ ...GatewayTimeoutErrorOptions, ...options });
    }
}
