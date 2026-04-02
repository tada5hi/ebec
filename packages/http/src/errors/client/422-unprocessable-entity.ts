import { ClientError } from '../base';
import type { ErrorInput, ErrorOptions } from '../../types';

export const UnprocessableEntityErrorOptions = {
    code: 'UNPROCESSABLE_ENTITY',
    statusCode: 422,
    statusMessage: 'Unprocessable Entity',
} as const;

export class UnprocessableEntityError extends ClientError {
    constructor(input: ErrorInput = {}) {
        const options: ErrorOptions = typeof input === 'string' ? { message: input } : input;
        super({
            ...options,
            code: options.code ?? UnprocessableEntityErrorOptions.code,
            statusCode: options.statusCode ?? UnprocessableEntityErrorOptions.statusCode,
            statusMessage: options.statusMessage ?? UnprocessableEntityErrorOptions.statusMessage,
        });
    }
}
