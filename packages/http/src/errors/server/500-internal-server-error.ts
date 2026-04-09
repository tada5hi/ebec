import { ServerError } from '../base';
import type { HTTPErrorInput, HTTPErrorOptions } from '../../types';

export const InternalServerErrorOptions = {
    code: 'INTERNAL_SERVER_ERROR',
    status: 500,
} as const;

export class InternalServerError extends ServerError {
    constructor(input: HTTPErrorInput = {}) {
        const options: HTTPErrorOptions = typeof input === 'string' ? { message: input } : input;
        super({
            ...options,
            code: options.code ?? InternalServerErrorOptions.code,
            status: options.status ?? options.statusCode ?? InternalServerErrorOptions.status,
        });
    }
}
