import { ServerError } from '../base';
import type { HTTPErrorInput, HTTPErrorOptions } from '../../types';

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
    }
}
