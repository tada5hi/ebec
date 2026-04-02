import { ClientError } from '../base';
import type { ErrorInput, ErrorOptions } from '../../types';

export const ForbiddenErrorOptions = {
    code: 'FORBIDDEN',
    statusCode: 403,
    statusMessage: 'Forbidden',
} as const;

export class ForbiddenError extends ClientError {
    constructor(input: ErrorInput = {}) {
        const options: ErrorOptions = typeof input === 'string' ? { message: input } : input;
        super({ ...ForbiddenErrorOptions, ...options });
    }
}
