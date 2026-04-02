import { ClientError } from '../base';
import type { ErrorInput, ErrorOptions } from '../../types';

export const BadRequestErrorOptions = {
    code: 'BAD_REQUEST',
    statusCode: 400,
    statusMessage: 'Bad Request',
} as const;

export class BadRequestError extends ClientError {
    constructor(input: ErrorInput = {}) {
        const options: ErrorOptions = typeof input === 'string' ? { message: input } : input;
        super({
            ...options,
            code: options.code ?? BadRequestErrorOptions.code,
            statusCode: options.statusCode ?? BadRequestErrorOptions.statusCode,
            statusMessage: options.statusMessage ?? BadRequestErrorOptions.statusMessage,
        });
    }
}
