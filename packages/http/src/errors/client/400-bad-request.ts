import { ClientError } from '../base';
import type { HTTPErrorInput, HTTPErrorOptions } from '../../types';

export const BadRequestErrorOptions = {
    code: 'BAD_REQUEST',
    statusCode: 400,
    statusMessage: 'Bad Request',
} as const;

export class BadRequestError extends ClientError {
    constructor(input: HTTPErrorInput = {}) {
        const options: HTTPErrorOptions = typeof input === 'string' ? { message: input } : input;
        super({
            ...options,
            code: options.code ?? BadRequestErrorOptions.code,
            statusCode: options.statusCode ?? BadRequestErrorOptions.statusCode,
            statusMessage: options.statusMessage ?? BadRequestErrorOptions.statusMessage,
        });
    }
}
