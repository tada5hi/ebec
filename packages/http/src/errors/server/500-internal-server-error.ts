import { ServerError } from '../base';
import type { ErrorInput, ErrorOptions } from '../../types';

export const InternalServerErrorOptions = {
    code: 'INTERNAL_SERVER_ERROR',
    statusCode: 500,
    statusMessage: 'Internal Server Error',
} as const;

export class InternalServerError extends ServerError {
    constructor(input: ErrorInput = {}) {
        const options: ErrorOptions = typeof input === 'string' ? { message: input } : input;
        super({ ...InternalServerErrorOptions, ...options });
    }
}
