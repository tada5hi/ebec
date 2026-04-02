import { ClientError } from '../base';
import type { ErrorInput, ErrorOptions } from '../../types';

export const ClientClosedRequestErrorOptions = {
    code: 'CLIENT_CLOSED_REQUEST',
    statusCode: 499,
    statusMessage: 'Client Closed Request',
} as const;

export class ClientClosedRequestError extends ClientError {
    constructor(input: ErrorInput = {}) {
        const options: ErrorOptions = typeof input === 'string' ? { message: input } : input;
        super({ ...ClientClosedRequestErrorOptions, ...options });
    }
}
