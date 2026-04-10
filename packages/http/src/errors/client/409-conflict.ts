import { ClientError } from '../base';
import type { HTTPErrorInput, HTTPErrorOptions } from '../../types';

export const ConflictErrorOptions = {
    code: 'CONFLICT',
    status: 409,
} as const;

export class ConflictError extends ClientError {
    constructor(input: HTTPErrorInput = {}) {
        const options: HTTPErrorOptions = typeof input === 'string' ? { message: input } : input;
        super({
            ...options,
            code: options.code ?? ConflictErrorOptions.code,
            status: options.status ?? options.statusCode ?? ConflictErrorOptions.status,
        });
    }
}
