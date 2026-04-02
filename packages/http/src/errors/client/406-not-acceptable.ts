import { ClientError } from '../base';
import type { ErrorInput, ErrorOptions } from '../../types';

export const NotAcceptableErrorOptions = {
    code: 'NOT_ACCEPTABLE',
    statusCode: 406,
    statusMessage: 'Not Acceptable',
} as const;

export class NotAcceptableError extends ClientError {
    constructor(input: ErrorInput = {}) {
        const options: ErrorOptions = typeof input === 'string' ? { message: input } : input;
        super({ ...NotAcceptableErrorOptions, ...options });
    }
}
