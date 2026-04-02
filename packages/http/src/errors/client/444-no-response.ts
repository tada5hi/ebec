import { ClientError } from '../base';
import type { ErrorInput, ErrorOptions } from '../../types';

export const NoResponseErrorOptions = {
    code: 'NO_RESPONSE',
    statusCode: 444,
    statusMessage: 'No Response',
} as const;

export class NoResponseError extends ClientError {
    constructor(input: ErrorInput = {}) {
        const options: ErrorOptions = typeof input === 'string' ? { message: input } : input;
        super({ ...NoResponseErrorOptions, ...options });
    }
}
