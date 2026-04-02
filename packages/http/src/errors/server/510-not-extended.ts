import { ServerError } from '../base';
import type { ErrorInput, ErrorOptions } from '../../types';

export const NotExtendedErrorOptions = {
    code: 'NOT_EXTENDED',
    statusCode: 510,
    statusMessage: 'Not Extended',
} as const;

export class NotExtendedError extends ServerError {
    constructor(input: ErrorInput = {}) {
        const options: ErrorOptions = typeof input === 'string' ? { message: input } : input;
        super({
            ...options,
            code: options.code ?? NotExtendedErrorOptions.code,
            statusCode: options.statusCode ?? NotExtendedErrorOptions.statusCode,
            statusMessage: options.statusMessage ?? NotExtendedErrorOptions.statusMessage,
        });
    }
}
