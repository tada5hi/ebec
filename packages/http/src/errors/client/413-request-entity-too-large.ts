import { ClientError } from '../base';
import type { HTTPErrorInput, HTTPErrorOptions } from '../../types';

export const RequestEntityTooLargeErrorOptions = {
    code: 'REQUEST_ENTITY_TOO_LARGE',
    statusCode: 413,
    statusMessage: 'Request Entity Too Large',
} as const;

export class RequestEntityTooLargeError extends ClientError {
    constructor(input: HTTPErrorInput = {}) {
        const options: HTTPErrorOptions = typeof input === 'string' ? { message: input } : input;
        super({
            ...options,
            code: options.code ?? RequestEntityTooLargeErrorOptions.code,
            statusCode: options.statusCode ?? RequestEntityTooLargeErrorOptions.statusCode,
            statusMessage: options.statusMessage ?? RequestEntityTooLargeErrorOptions.statusMessage,
        });
    }
}
