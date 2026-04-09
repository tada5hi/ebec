import { ClientError } from '../base';
import type { HTTPErrorInput, HTTPErrorOptions } from '../../types';

export const LockedErrorOptions = {
    code: 'LOCKED',
    status: 423,
    statusMessage: 'Locked',
} as const;

export class LockedError extends ClientError {
    constructor(input: HTTPErrorInput = {}) {
        const options: HTTPErrorOptions = typeof input === 'string' ? { message: input } : input;
        super({
            ...options,
            code: options.code ?? LockedErrorOptions.code,
            status: options.status ?? options.statusCode ?? LockedErrorOptions.status,
            statusMessage: options.statusMessage ?? LockedErrorOptions.statusMessage,
        });
    }
}
