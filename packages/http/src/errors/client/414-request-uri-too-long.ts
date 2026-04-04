import { ClientError } from '../base';
import type { HTTPErrorInput, HTTPErrorOptions } from '../../types';

export const RequestURITooLongErrorOptions = {
    code: 'REQUEST_URI_TOO_LONG',
    statusCode: 414,
    statusMessage: 'Request-URI Too Long',
} as const;

export class RequestURITooLongError extends ClientError {
    constructor(input: HTTPErrorInput = {}) {
        const options: HTTPErrorOptions = typeof input === 'string' ? { message: input } : input;
        super({
            ...options,
            code: options.code ?? RequestURITooLongErrorOptions.code,
            statusCode: options.statusCode ?? RequestURITooLongErrorOptions.statusCode,
            statusMessage: options.statusMessage ?? RequestURITooLongErrorOptions.statusMessage,
        });
    }
}
