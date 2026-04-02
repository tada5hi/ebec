import { ClientError } from '../base';
import type { ErrorInput, ErrorOptions } from '../../types';

export const TooManyRequestsErrorOptions = {
    code: 'TOO_MANY_REQUESTS',
    statusCode: 429,
    statusMessage: 'Too Many Requests',
} as const;

export class TooManyRequestsError extends ClientError {
    constructor(input: ErrorInput = {}) {
        const options: ErrorOptions = typeof input === 'string' ? { message: input } : input;
        super({
            ...options,
            code: options.code ?? TooManyRequestsErrorOptions.code,
            statusCode: options.statusCode ?? TooManyRequestsErrorOptions.statusCode,
            statusMessage: options.statusMessage ?? TooManyRequestsErrorOptions.statusMessage,
        });
    }
}
