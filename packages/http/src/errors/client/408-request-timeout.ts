import { ClientError } from '../base';
import type { ErrorInput, ErrorOptions } from '../../types';

export const RequestTimeoutErrorOptions = {
    code: 'REQUEST_TIMEOUT',
    statusCode: 408,
    statusMessage: 'Request Timeout',
} as const;

export class RequestTimeoutError extends ClientError {
    constructor(input: ErrorInput = {}) {
        const options: ErrorOptions = typeof input === 'string' ? { message: input } : input;
        super({
            ...options,
            code: options.code ?? RequestTimeoutErrorOptions.code,
            statusCode: options.statusCode ?? RequestTimeoutErrorOptions.statusCode,
            statusMessage: options.statusMessage ?? RequestTimeoutErrorOptions.statusMessage,
        });
    }
}
