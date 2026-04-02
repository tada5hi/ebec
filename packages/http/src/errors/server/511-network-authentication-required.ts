import { ServerError } from '../base';
import type { ErrorInput, ErrorOptions } from '../../types';

export const NetworkAuthenticationRequiredErrorOptions = {
    code: 'NETWORK_AUTHENTICATION_REQUIRED',
    statusCode: 511,
    statusMessage: 'Network Authentication Required',
} as const;

export class NetworkAuthenticationRequiredError extends ServerError {
    constructor(input: ErrorInput = {}) {
        const options: ErrorOptions = typeof input === 'string' ? { message: input } : input;
        super({
            ...options,
            code: options.code ?? NetworkAuthenticationRequiredErrorOptions.code,
            statusCode: options.statusCode ?? NetworkAuthenticationRequiredErrorOptions.statusCode,
            statusMessage: options.statusMessage ?? NetworkAuthenticationRequiredErrorOptions.statusMessage,
        });
    }
}
