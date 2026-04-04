import { ClientError } from '../base';
import type { HTTPErrorInput, HTTPErrorOptions } from '../../types';

export const RequestHeaderFieldsTooLargeErrorOptions = {
    code: 'REQUEST_HEADER_FIELDS_TOO_LARGE',
    statusCode: 431,
    statusMessage: 'Request Header Fields Too Large',
} as const;

export class RequestHeaderFieldsTooLargeError extends ClientError {
    constructor(input: HTTPErrorInput = {}) {
        const options: HTTPErrorOptions = typeof input === 'string' ? { message: input } : input;
        super({
            ...options,
            code: options.code ?? RequestHeaderFieldsTooLargeErrorOptions.code,
            statusCode: options.statusCode ?? RequestHeaderFieldsTooLargeErrorOptions.statusCode,
            statusMessage: options.statusMessage ?? RequestHeaderFieldsTooLargeErrorOptions.statusMessage,
        });
    }
}
