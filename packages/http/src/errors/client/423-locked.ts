import { ClientError } from '../base';
import type { ErrorInput, ErrorOptions } from '../../types';

export const LockedErrorOptions = {
    code: 'LOCKED',
    statusCode: 423,
    statusMessage: 'Locked',
} as const;

export class LockedError extends ClientError {
    constructor(input: ErrorInput = {}) {
        const options: ErrorOptions = typeof input === 'string' ? { message: input } : input;
        super({ ...LockedErrorOptions, ...options });
    }
}
