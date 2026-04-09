import { ClientError } from '../base';
import type { HTTPErrorInput, HTTPErrorOptions } from '../../types';

export const NoResponseErrorOptions = {
    code: 'NO_RESPONSE',
    status: 444,
} as const;

export class NoResponseError extends ClientError {
    constructor(input: HTTPErrorInput = {}) {
        const options: HTTPErrorOptions = typeof input === 'string' ? { message: input } : input;
        super({
            ...options,
            code: options.code ?? NoResponseErrorOptions.code,
            status: options.status ?? options.statusCode ?? NoResponseErrorOptions.status,
        });
    }
}
