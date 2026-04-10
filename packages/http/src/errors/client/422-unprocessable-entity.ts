import { ClientError } from '../base';
import type { HTTPErrorInput, HTTPErrorOptions } from '../../types';

export const UnprocessableEntityErrorOptions = {
    code: 'UNPROCESSABLE_ENTITY',
    status: 422,
} as const;

export class UnprocessableEntityError extends ClientError {
    constructor(input: HTTPErrorInput = {}) {
        const options: HTTPErrorOptions = typeof input === 'string' ? { message: input } : input;
        super({
            ...options,
            code: options.code ?? UnprocessableEntityErrorOptions.code,
            status: options.status ?? options.statusCode ?? UnprocessableEntityErrorOptions.status,
        });
    }
}
