import { ClientError } from '../base';
import type { HTTPErrorInput, HTTPErrorOptions } from '../../types';

export const TooManyRequestsErrorOptions = {
    code: 'TOO_MANY_REQUESTS',
    status: 429,
} as const;

export class TooManyRequestsError extends ClientError {
    constructor(input: HTTPErrorInput = {}) {
        const options: HTTPErrorOptions = typeof input === 'string' ? { message: input } : input;
        super({
            ...options,
            code: options.code ?? TooManyRequestsErrorOptions.code,
            status: options.status ?? options.statusCode ?? TooManyRequestsErrorOptions.status,
        });
    }
}
