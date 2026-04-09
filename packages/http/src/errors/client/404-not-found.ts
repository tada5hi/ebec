import { ClientError } from '../base';
import type { HTTPErrorInput, HTTPErrorOptions } from '../../types';

export const NotFoundErrorOptions = {
    code: 'NOT_FOUND',
    status: 404,
} as const;

export class NotFoundError extends ClientError {
    constructor(input: HTTPErrorInput = {}) {
        const options: HTTPErrorOptions = typeof input === 'string' ? { message: input } : input;
        super({
            ...options,
            code: options.code ?? NotFoundErrorOptions.code,
            status: options.status ?? options.statusCode ?? NotFoundErrorOptions.status,
        });
    }
}
