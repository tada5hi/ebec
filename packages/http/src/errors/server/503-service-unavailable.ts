import { ServerError } from '../base';
import type { ErrorInput, ErrorOptions } from '../../types';

export const ServiceUnavailableErrorOptions = {
    code: 'SERVICE_UNAVAILABLE',
    statusCode: 503,
    statusMessage: 'Service Unavailable',
} as const;

export class ServiceUnavailableError extends ServerError {
    constructor(input: ErrorInput = {}) {
        const options: ErrorOptions = typeof input === 'string' ? { message: input } : input;
        super({
            ...options,
            code: options.code ?? ServiceUnavailableErrorOptions.code,
            statusCode: options.statusCode ?? ServiceUnavailableErrorOptions.statusCode,
            statusMessage: options.statusMessage ?? ServiceUnavailableErrorOptions.statusMessage,
        });
    }
}
