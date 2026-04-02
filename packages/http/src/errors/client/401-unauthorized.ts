import { ClientError } from '../base';
import type { ErrorInput, ErrorOptions } from '../../types';

export const UnauthorizedErrorOptions = {
    code: 'UNAUTHORIZED',
    statusCode: 401,
    statusMessage: 'Unauthorized',
} as const;

export class UnauthorizedError extends ClientError {
    constructor(input: ErrorInput = {}) {
        const options: ErrorOptions = typeof input === 'string' ? { message: input } : input;
        super({
            ...options,
            code: options.code ?? UnauthorizedErrorOptions.code,
            statusCode: options.statusCode ?? UnauthorizedErrorOptions.statusCode,
            statusMessage: options.statusMessage ?? UnauthorizedErrorOptions.statusMessage,
        });
    }
}
