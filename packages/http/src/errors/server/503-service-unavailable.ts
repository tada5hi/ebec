import { ServerError } from '../base';
import type { HTTPErrorInput, HTTPErrorOptions } from '../../types';

export const ServiceUnavailableErrorOptions = {
    code: 'SERVICE_UNAVAILABLE',
    status: 503,
    statusMessage: 'Service Unavailable',
} as const;

export class ServiceUnavailableError extends ServerError {
    constructor(input: HTTPErrorInput = {}) {
        const options: HTTPErrorOptions = typeof input === 'string' ? { message: input } : input;
        super({
            ...options,
            code: options.code ?? ServiceUnavailableErrorOptions.code,
            status: options.status ?? options.statusCode ?? ServiceUnavailableErrorOptions.status,
            statusMessage: options.statusMessage ?? ServiceUnavailableErrorOptions.statusMessage,
        });
    }
}
