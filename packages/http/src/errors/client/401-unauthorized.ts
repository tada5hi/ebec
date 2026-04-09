import { ClientError } from '../base';
import type { HTTPErrorInput, HTTPErrorOptions } from '../../types';

export const UnauthorizedErrorOptions = {
    code: 'UNAUTHORIZED',
    status: 401,
    statusMessage: 'Unauthorized',
} as const;

export class UnauthorizedError extends ClientError {
    constructor(input: HTTPErrorInput = {}) {
        const options: HTTPErrorOptions = typeof input === 'string' ? { message: input } : input;
        super({
            ...options,
            code: options.code ?? UnauthorizedErrorOptions.code,
            status: options.status ?? options.statusCode ?? UnauthorizedErrorOptions.status,
            statusMessage: options.statusMessage ?? UnauthorizedErrorOptions.statusMessage,
        });
    }
}
