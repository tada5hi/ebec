import { ClientError } from '../base';
import type { HTTPErrorInput, HTTPErrorOptions } from '../../types';

export const BadRequestErrorOptions = {
    code: 'BAD_REQUEST',
    status: 400,
    statusMessage: 'Bad Request',
} as const;

export class BadRequestError extends ClientError {
    constructor(input: HTTPErrorInput = {}) {
        const options: HTTPErrorOptions = typeof input === 'string' ? { message: input } : input;
        super({
            ...options,
            code: options.code ?? BadRequestErrorOptions.code,
            status: options.status ?? options.statusCode ?? BadRequestErrorOptions.status,
            statusMessage: options.statusMessage ?? BadRequestErrorOptions.statusMessage,
        });
    }
}
