import { ServerError } from '../base';
import type { HTTPErrorInput, HTTPErrorOptions } from '../../types';

export const InternalServerErrorOptions = {
    code: 'INTERNAL_SERVER_ERROR',
    statusCode: 500,
    statusMessage: 'Internal Server Error',
} as const;

export class InternalServerError extends ServerError {
    constructor(input: HTTPErrorInput = {}) {
        const options: HTTPErrorOptions = typeof input === 'string' ? { message: input } : input;
        super({
            ...options,
            code: options.code ?? InternalServerErrorOptions.code,
            statusCode: options.statusCode ?? InternalServerErrorOptions.statusCode,
            statusMessage: options.statusMessage ?? InternalServerErrorOptions.statusMessage,
        });
    }
}
