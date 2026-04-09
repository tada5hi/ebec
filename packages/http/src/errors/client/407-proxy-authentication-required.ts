import { ClientError } from '../base';
import type { HTTPErrorInput, HTTPErrorOptions } from '../../types';

export const ProxyAuthenticationRequiredErrorOptions = {
    code: 'PROXY_AUTHENTICATION_REQUIRED',
    status: 407,
} as const;

export class ProxyAuthenticationRequiredError extends ClientError {
    constructor(input: HTTPErrorInput = {}) {
        const options: HTTPErrorOptions = typeof input === 'string' ? { message: input } : input;
        super({
            ...options,
            code: options.code ?? ProxyAuthenticationRequiredErrorOptions.code,
            status: options.status ?? options.statusCode ?? ProxyAuthenticationRequiredErrorOptions.status,
        });
    }
}
