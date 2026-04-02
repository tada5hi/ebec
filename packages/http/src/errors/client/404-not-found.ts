import { ClientError } from '../base';
import type { ErrorInput, ErrorOptions } from '../../types';

export const NotFoundErrorOptions = {
    code: 'NOT_FOUND',
    statusCode: 404,
    statusMessage: 'Not Found',
} as const;

export class NotFoundError extends ClientError {
    constructor(input: ErrorInput = {}) {
        const options: ErrorOptions = typeof input === 'string' ? { message: input } : input;
        super({ ...NotFoundErrorOptions, ...options });
    }
}
