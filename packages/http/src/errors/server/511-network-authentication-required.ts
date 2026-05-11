import { markInstanceof } from '@ebec/core';
import { ServerError } from '../base';
import type { HTTPErrorInput, HTTPErrorOptions } from '../../types';

export const NETWORK_AUTHENTICATION_REQUIRED_ERROR_INSTANCE = Symbol.for('@ebec/http/NetworkAuthenticationRequiredError');

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
        markInstanceof(this, NETWORK_AUTHENTICATION_REQUIRED_ERROR_INSTANCE);
    }
}
