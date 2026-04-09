import { ClientError } from '../base';
import type { HTTPErrorInput, HTTPErrorOptions } from '../../types';

export const ClientClosedRequestErrorOptions = {
    code: 'CLIENT_CLOSED_REQUEST',
    status: 499,
    statusMessage: 'Client Closed Request',
} as const;

export class ClientClosedRequestError extends ClientError {
    constructor(input: HTTPErrorInput = {}) {
        const options: HTTPErrorOptions = typeof input === 'string' ? { message: input } : input;
        super({
            ...options,
            code: options.code ?? ClientClosedRequestErrorOptions.code,
            status: options.status ?? options.statusCode ?? ClientClosedRequestErrorOptions.status,
            statusMessage: options.statusMessage ?? ClientClosedRequestErrorOptions.statusMessage,
        });
    }
}
