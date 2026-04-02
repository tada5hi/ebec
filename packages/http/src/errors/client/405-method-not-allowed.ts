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
        super({
            ...options,
            code: options.code ?? MethodNotAllowedErrorOptions.code,
            statusCode: options.statusCode ?? MethodNotAllowedErrorOptions.statusCode,
            statusMessage: options.statusMessage ?? MethodNotAllowedErrorOptions.statusMessage,
        });
    }
}
