import { ServerError } from '../base';
import type { HTTPErrorInput, HTTPErrorOptions } from '../../types';

export const InsufficientStorageErrorOptions = {
    code: 'INSUFFICIENT_STORAGE',
    statusCode: 507,
    statusMessage: 'Insufficient Storage',
} as const;

export class InsufficientStorageError extends ServerError {
    constructor(input: HTTPErrorInput = {}) {
        const options: HTTPErrorOptions = typeof input === 'string' ? { message: input } : input;
        super({
            ...options,
            code: options.code ?? InsufficientStorageErrorOptions.code,
            statusCode: options.statusCode ?? InsufficientStorageErrorOptions.statusCode,
            statusMessage: options.statusMessage ?? InsufficientStorageErrorOptions.statusMessage,
        });
    }
}
