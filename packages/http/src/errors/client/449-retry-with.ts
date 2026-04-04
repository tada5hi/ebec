import { ClientError } from '../base';
import type { HTTPErrorInput, HTTPErrorOptions } from '../../types';

export const RetryWithErrorOptions = {
    code: 'RETRY_WITH',
    statusCode: 449,
    statusMessage: 'Retry With',
} as const;

export class RetryWithError extends ClientError {
    constructor(input: HTTPErrorInput = {}) {
        const options: HTTPErrorOptions = typeof input === 'string' ? { message: input } : input;
        super({
            ...options,
            code: options.code ?? RetryWithErrorOptions.code,
            statusCode: options.statusCode ?? RetryWithErrorOptions.statusCode,
            statusMessage: options.statusMessage ?? RetryWithErrorOptions.statusMessage,
        });
    }
}
