import { markInstanceof } from '@ebec/core';
import { ServerError } from '../base';
import type { HTTPErrorInput, HTTPErrorOptions } from '../../types';

export const SERVICE_UNAVAILABLE_ERROR_INSTANCE = Symbol.for('@ebec/http/ServiceUnavailableError');

export const ServiceUnavailableErrorOptions = {
    code: 'SERVICE_UNAVAILABLE',
    status: 503,
} as const;

export class ServiceUnavailableError extends ServerError {
    constructor(input: HTTPErrorInput = {}) {
        const options: HTTPErrorOptions = typeof input === 'string' ? { message: input } : input;
        super({
            ...options,
            code: options.code ?? ServiceUnavailableErrorOptions.code,
            status: options.status ?? options.statusCode ?? ServiceUnavailableErrorOptions.status,
        });
        markInstanceof(this, SERVICE_UNAVAILABLE_ERROR_INSTANCE);
    }
}
