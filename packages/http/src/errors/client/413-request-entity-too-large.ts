import { ClientError } from '../base';
import type { ErrorInput, ErrorOptions } from '../../types';

export const RequestEntityTooLargeErrorOptions = {
    code: 'REQUEST_ENTITY_TOO_LARGE',
    statusCode: 413,
    statusMessage: 'Request Entity Too Large',
} as const;

export class RequestEntityTooLargeError extends ClientError {
    constructor(input: ErrorInput = {}) {
        const options: ErrorOptions = typeof input === 'string' ? { message: input } : input;
        super({ ...RequestEntityTooLargeErrorOptions, ...options });
    }
}
