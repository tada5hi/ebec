import { ClientError } from '../base';
import type { ErrorInput, ErrorOptions } from '../../types';

export const MethodNotAllowedErrorOptions = {
    code: 'METHOD_NOT_ALLOWED',
    statusCode: 405,
    statusMessage: 'Method Not Allowed',
} as const;

export class MethodNotAllowedError extends ClientError {
    constructor(input: ErrorInput = {}) {
        const options: ErrorOptions = typeof input === 'string' ? { message: input } : input;
        super({ ...MethodNotAllowedErrorOptions, ...options });
    }
}
