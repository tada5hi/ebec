import { ServerError } from '../base';
import type { HTTPErrorInput, HTTPErrorOptions } from '../../types';

export const NotExtendedErrorOptions = {
    code: 'NOT_EXTENDED',
    status: 510,
    statusMessage: 'Not Extended',
} as const;

export class NotExtendedError extends ServerError {
    constructor(input: HTTPErrorInput = {}) {
        const options: HTTPErrorOptions = typeof input === 'string' ? { message: input } : input;
        super({
            ...options,
            code: options.code ?? NotExtendedErrorOptions.code,
            status: options.status ?? options.statusCode ?? NotExtendedErrorOptions.status,
            statusMessage: options.statusMessage ?? NotExtendedErrorOptions.statusMessage,
        });
    }
}
