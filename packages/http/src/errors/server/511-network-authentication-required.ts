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
        super({ ...NetworkAuthenticationRequiredErrorOptions, ...options });
    }
}
