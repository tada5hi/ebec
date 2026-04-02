import { ClientError } from '../base';
import type { ErrorInput, ErrorOptions } from '../../types';

export const RequestURITooLongErrorOptions = {
    code: 'REQUEST_URI_TOO_LONG',
    statusCode: 414,
    statusMessage: 'Request-URI Too Long',
} as const;

export class RequestURITooLongError extends ClientError {
    constructor(input: ErrorInput = {}) {
        const options: ErrorOptions = typeof input === 'string' ? { message: input } : input;
        super({ ...RequestURITooLongErrorOptions, ...options });
    }
}
