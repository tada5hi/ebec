import { ClientError } from '../base';
import type { ErrorInput, ErrorOptions } from '../../types';

export const ConflictErrorOptions = {
    code: 'CONFLICT',
    statusCode: 409,
    statusMessage: 'Conflict',
} as const;

export class ConflictError extends ClientError {
    constructor(input: ErrorInput = {}) {
        const options: ErrorOptions = typeof input === 'string' ? { message: input } : input;
        super({
            ...options,
            code: options.code ?? ConflictErrorOptions.code,
            statusCode: options.statusCode ?? ConflictErrorOptions.statusCode,
            statusMessage: options.statusMessage ?? ConflictErrorOptions.statusMessage,
        });
    }
}
