import { ClientError } from '../base';
import type { HTTPErrorInput, HTTPErrorOptions } from '../../types';

export const RequestHeaderFieldsTooLargeErrorOptions = {
    code: 'REQUEST_HEADER_FIELDS_TOO_LARGE',
    status: 431,
} as const;

export class RequestHeaderFieldsTooLargeError extends ClientError {
    constructor(input: HTTPErrorInput = {}) {
        const options: HTTPErrorOptions = typeof input === 'string' ? { message: input } : input;
        super({
            ...options,
            code: options.code ?? RequestHeaderFieldsTooLargeErrorOptions.code,
            status: options.status ?? options.statusCode ?? RequestHeaderFieldsTooLargeErrorOptions.status,
        });
    }
}
