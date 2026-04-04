import { ClientError } from '../base';
import type { HTTPErrorInput, HTTPErrorOptions } from '../../types';

export const NotFoundErrorOptions = {
    code: 'NOT_FOUND',
    statusCode: 404,
    statusMessage: 'Not Found',
} as const;

export class NotFoundError extends ClientError {
    constructor(input: HTTPErrorInput = {}) {
        const options: HTTPErrorOptions = typeof input === 'string' ? { message: input } : input;
        super({
            ...options,
            code: options.code ?? NotFoundErrorOptions.code,
            statusCode: options.statusCode ?? NotFoundErrorOptions.statusCode,
            statusMessage: options.statusMessage ?? NotFoundErrorOptions.statusMessage,
        });
    }
}
