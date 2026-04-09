import { ServerError } from '../base';
import type { HTTPErrorInput, HTTPErrorOptions } from '../../types';

export const InsufficientStorageErrorOptions = {
    code: 'INSUFFICIENT_STORAGE',
    status: 507,
} as const;

export class InsufficientStorageError extends ServerError {
    constructor(input: HTTPErrorInput = {}) {
        const options: HTTPErrorOptions = typeof input === 'string' ? { message: input } : input;
        super({
            ...options,
            code: options.code ?? InsufficientStorageErrorOptions.code,
            status: options.status ?? options.statusCode ?? InsufficientStorageErrorOptions.status,
        });
    }
}
