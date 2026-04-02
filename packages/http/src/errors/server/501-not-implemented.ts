import { ServerError } from '../base';
import type { ErrorInput, ErrorOptions } from '../../types';

export const NotImplementedErrorOptions = {
    code: 'NOT_IMPLEMENTED',
    statusCode: 501,
    statusMessage: 'Not Implemented',
} as const;

export class NotImplementedError extends ServerError {
    constructor(input: ErrorInput = {}) {
        const options: ErrorOptions = typeof input === 'string' ? { message: input } : input;
        super({ ...NotImplementedErrorOptions, ...options });
    }
}
