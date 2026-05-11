import { markInstanceof } from '@ebec/core';
import { ServerError } from '../base';
import type { HTTPErrorInput, HTTPErrorOptions } from '../../types';

export const HTTP_VERSION_NOT_SUPPORTED_ERROR_INSTANCE = Symbol.for('@ebec/http/HTTPVersionNotSupportedError');

export const HTTPVersionNotSupportedErrorOptions = {
    code: 'HTTP_VERSION_NOT_SUPPORTED',
    status: 505,
} as const;

export class HTTPVersionNotSupportedError extends ServerError {
    constructor(input: HTTPErrorInput = {}) {
        const options: HTTPErrorOptions = typeof input === 'string' ? { message: input } : input;
        super({
            ...options,
            code: options.code ?? HTTPVersionNotSupportedErrorOptions.code,
            status: options.status ?? options.statusCode ?? HTTPVersionNotSupportedErrorOptions.status,
        });
        markInstanceof(this, HTTP_VERSION_NOT_SUPPORTED_ERROR_INSTANCE);
    }
}
