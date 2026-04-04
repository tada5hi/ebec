import { ServerError } from '../base';
import type { HTTPErrorInput, HTTPErrorOptions } from '../../types';

export const HTTPVersionNotSupportedErrorOptions = {
    code: 'HTTP_VERSION_NOT_SUPPORTED',
    statusCode: 505,
    statusMessage: 'HTTP Version Not Supported',
} as const;

export class HTTPVersionNotSupportedError extends ServerError {
    constructor(input: HTTPErrorInput = {}) {
        const options: HTTPErrorOptions = typeof input === 'string' ? { message: input } : input;
        super({
            ...options,
            code: options.code ?? HTTPVersionNotSupportedErrorOptions.code,
            statusCode: options.statusCode ?? HTTPVersionNotSupportedErrorOptions.statusCode,
            statusMessage: options.statusMessage ?? HTTPVersionNotSupportedErrorOptions.statusMessage,
        });
    }
}
