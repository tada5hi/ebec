import { ServerError } from '../base';
import type { HTTPErrorInput, HTTPErrorOptions } from '../../types';

export const NetworkAuthenticationRequiredErrorOptions = {
    code: 'NETWORK_AUTHENTICATION_REQUIRED',
    status: 511,
} as const;

export class NetworkAuthenticationRequiredError extends ServerError {
    constructor(input: HTTPErrorInput = {}) {
        const options: HTTPErrorOptions = typeof input === 'string' ? { message: input } : input;
        super({
            ...options,
            code: options.code ?? NetworkAuthenticationRequiredErrorOptions.code,
            status: options.status ?? options.statusCode ?? NetworkAuthenticationRequiredErrorOptions.status,
        });
    }
}
