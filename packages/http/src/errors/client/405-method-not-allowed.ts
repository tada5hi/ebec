import { ClientError } from '../base';
import type { HTTPErrorInput, HTTPErrorOptions } from '../../types';

export const MethodNotAllowedErrorOptions = {
    code: 'METHOD_NOT_ALLOWED',
    status: 405,
    statusMessage: 'Method Not Allowed',
} as const;

export class MethodNotAllowedError extends ClientError {
    constructor(input: HTTPErrorInput = {}) {
        const options: HTTPErrorOptions = typeof input === 'string' ? { message: input } : input;
        super({
            ...options,
            code: options.code ?? MethodNotAllowedErrorOptions.code,
            status: options.status ?? options.statusCode ?? MethodNotAllowedErrorOptions.status,
            statusMessage: options.statusMessage ?? MethodNotAllowedErrorOptions.statusMessage,
        });
    }
}
