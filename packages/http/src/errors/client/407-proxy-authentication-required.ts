import { ClientError } from '../base';
import type { ErrorInput, ErrorOptions } from '../../types';

export const ProxyAuthenticationRequiredErrorOptions = {
    code: 'PROXY_AUTHENTICATION_REQUIRED',
    statusCode: 407,
    statusMessage: 'Proxy Authentication Required',
} as const;

export class ProxyAuthenticationRequiredError extends ClientError {
    constructor(input: ErrorInput = {}) {
        const options: ErrorOptions = typeof input === 'string' ? { message: input } : input;
        super({
            ...options,
            code: options.code ?? ProxyAuthenticationRequiredErrorOptions.code,
            statusCode: options.statusCode ?? ProxyAuthenticationRequiredErrorOptions.statusCode,
            statusMessage: options.statusMessage ?? ProxyAuthenticationRequiredErrorOptions.statusMessage,
        });
    }
}
