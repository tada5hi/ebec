import { ClientError } from '../base';
import type { HTTPErrorInput, HTTPErrorOptions } from '../../types';

export const TooManyRequestsErrorOptions = {
    code: 'TOO_MANY_REQUESTS',
    statusCode: 429,
    statusMessage: 'Too Many Requests',
} as const;

export class TooManyRequestsError extends ClientError {
    constructor(input: HTTPErrorInput = {}) {
        const options: HTTPErrorOptions = typeof input === 'string' ? { message: input } : input;
        super({
            ...options,
            code: options.code ?? TooManyRequestsErrorOptions.code,
            statusCode: options.statusCode ?? TooManyRequestsErrorOptions.statusCode,
            statusMessage: options.statusMessage ?? TooManyRequestsErrorOptions.statusMessage,
        });
    }
}
