import { ClientError } from '../base';
import type { HTTPErrorInput, HTTPErrorOptions } from '../../types';

export const NoResponseErrorOptions = {
    code: 'NO_RESPONSE',
    statusCode: 444,
    statusMessage: 'No Response',
} as const;

export class NoResponseError extends ClientError {
    constructor(input: HTTPErrorInput = {}) {
        const options: HTTPErrorOptions = typeof input === 'string' ? { message: input } : input;
        super({
            ...options,
            code: options.code ?? NoResponseErrorOptions.code,
            statusCode: options.statusCode ?? NoResponseErrorOptions.statusCode,
            statusMessage: options.statusMessage ?? NoResponseErrorOptions.statusMessage,
        });
    }
}
