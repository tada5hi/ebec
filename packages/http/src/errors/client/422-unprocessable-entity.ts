import { ClientError } from '../base';
import type { HTTPErrorInput, HTTPErrorOptions } from '../../types';

export const UnprocessableEntityErrorOptions = {
    code: 'UNPROCESSABLE_ENTITY',
    statusCode: 422,
    statusMessage: 'Unprocessable Entity',
} as const;

export class UnprocessableEntityError extends ClientError {
    constructor(input: HTTPErrorInput = {}) {
        const options: HTTPErrorOptions = typeof input === 'string' ? { message: input } : input;
        super({
            ...options,
            code: options.code ?? UnprocessableEntityErrorOptions.code,
            statusCode: options.statusCode ?? UnprocessableEntityErrorOptions.statusCode,
            statusMessage: options.statusMessage ?? UnprocessableEntityErrorOptions.statusMessage,
        });
    }
}
