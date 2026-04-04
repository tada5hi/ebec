import { ClientError } from '../base';
import type { HTTPErrorInput, HTTPErrorOptions } from '../../types';

export const UnauthorizedErrorOptions = {
    code: 'UNAUTHORIZED',
    statusCode: 401,
    statusMessage: 'Unauthorized',
} as const;

export class UnauthorizedError extends ClientError {
    constructor(input: HTTPErrorInput = {}) {
        const options: HTTPErrorOptions = typeof input === 'string' ? { message: input } : input;
        super({
            ...options,
            code: options.code ?? UnauthorizedErrorOptions.code,
            statusCode: options.statusCode ?? UnauthorizedErrorOptions.statusCode,
            statusMessage: options.statusMessage ?? UnauthorizedErrorOptions.statusMessage,
        });
    }
}
