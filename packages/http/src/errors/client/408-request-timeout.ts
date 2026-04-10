import { ClientError } from '../base';
import type { HTTPErrorInput, HTTPErrorOptions } from '../../types';

export const RequestTimeoutErrorOptions = {
    code: 'REQUEST_TIMEOUT',
    status: 408,
} as const;

export class RequestTimeoutError extends ClientError {
    constructor(input: HTTPErrorInput = {}) {
        const options: HTTPErrorOptions = typeof input === 'string' ? { message: input } : input;
        super({
            ...options,
            code: options.code ?? RequestTimeoutErrorOptions.code,
            status: options.status ?? options.statusCode ?? RequestTimeoutErrorOptions.status,
        });
    }
}
