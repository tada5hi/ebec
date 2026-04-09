import { ClientError } from '../base';
import type { HTTPErrorInput, HTTPErrorOptions } from '../../types';

export const GoneErrorOptions = {
    code: 'GONE',
    status: 410,
    statusMessage: 'Gone',
} as const;

export class GoneError extends ClientError {
    constructor(input: HTTPErrorInput = {}) {
        const options: HTTPErrorOptions = typeof input === 'string' ? { message: input } : input;
        super({
            ...options,
            code: options.code ?? GoneErrorOptions.code,
            status: options.status ?? options.statusCode ?? GoneErrorOptions.status,
            statusMessage: options.statusMessage ?? GoneErrorOptions.statusMessage,
        });
    }
}
