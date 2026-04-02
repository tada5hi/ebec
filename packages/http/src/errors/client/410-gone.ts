import { ClientError } from '../base';
import type { ErrorInput, ErrorOptions } from '../../types';

export const GoneErrorOptions = {
    code: 'GONE',
    statusCode: 410,
    statusMessage: 'Gone',
} as const;

export class GoneError extends ClientError {
    constructor(input: ErrorInput = {}) {
        const options: ErrorOptions = typeof input === 'string' ? { message: input } : input;
        super({ ...GoneErrorOptions, ...options });
    }
}
