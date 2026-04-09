import { ServerError } from '../base';
import type { HTTPErrorInput, HTTPErrorOptions } from '../../types';

export const NotImplementedErrorOptions = {
    code: 'NOT_IMPLEMENTED',
    status: 501,
    statusMessage: 'Not Implemented',
} as const;

export class NotImplementedError extends ServerError {
    constructor(input: HTTPErrorInput = {}) {
        const options: HTTPErrorOptions = typeof input === 'string' ? { message: input } : input;
        super({
            ...options,
            code: options.code ?? NotImplementedErrorOptions.code,
            status: options.status ?? options.statusCode ?? NotImplementedErrorOptions.status,
            statusMessage: options.statusMessage ?? NotImplementedErrorOptions.statusMessage,
        });
    }
}
