import { ClientError } from '../base';
import type { HTTPErrorInput, HTTPErrorOptions } from '../../types';

export const ConflictErrorOptions = {
    code: 'CONFLICT',
    statusCode: 409,
    statusMessage: 'Conflict',
} as const;

export class ConflictError extends ClientError {
    constructor(input: HTTPErrorInput = {}) {
        const options: HTTPErrorOptions = typeof input === 'string' ? { message: input } : input;
        super({
            ...options,
            code: options.code ?? ConflictErrorOptions.code,
            statusCode: options.statusCode ?? ConflictErrorOptions.statusCode,
            statusMessage: options.statusMessage ?? ConflictErrorOptions.statusMessage,
        });
    }
}
