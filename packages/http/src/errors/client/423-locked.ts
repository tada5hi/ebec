import { ClientError } from '../base';
import type { HTTPErrorInput, HTTPErrorOptions } from '../../types';

export const LockedErrorOptions = {
    code: 'LOCKED',
    statusCode: 423,
    statusMessage: 'Locked',
} as const;

export class LockedError extends ClientError {
    constructor(input: HTTPErrorInput = {}) {
        const options: HTTPErrorOptions = typeof input === 'string' ? { message: input } : input;
        super({
            ...options,
            code: options.code ?? LockedErrorOptions.code,
            statusCode: options.statusCode ?? LockedErrorOptions.statusCode,
            statusMessage: options.statusMessage ?? LockedErrorOptions.statusMessage,
        });
    }
}
