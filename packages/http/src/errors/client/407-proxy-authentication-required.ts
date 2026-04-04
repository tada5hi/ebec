import { ClientError } from '../base';
import type { HTTPErrorInput, HTTPErrorOptions } from '../../types';

export const ProxyAuthenticationRequiredErrorOptions = {
    code: 'PROXY_AUTHENTICATION_REQUIRED',
    statusCode: 407,
    statusMessage: 'Proxy Authentication Required',
} as const;

export class ProxyAuthenticationRequiredError extends ClientError {
    constructor(input: HTTPErrorInput = {}) {
        const options: HTTPErrorOptions = typeof input === 'string' ? { message: input } : input;
        super({
            ...options,
            code: options.code ?? ProxyAuthenticationRequiredErrorOptions.code,
            statusCode: options.statusCode ?? ProxyAuthenticationRequiredErrorOptions.statusCode,
            statusMessage: options.statusMessage ?? ProxyAuthenticationRequiredErrorOptions.statusMessage,
        });
    }
}
