import { ClientError } from '../base';
import type { HTTPErrorInput, HTTPErrorOptions } from '../../types';

export const NotAcceptableErrorOptions = {
    code: 'NOT_ACCEPTABLE',
    status: 406,
} as const;

export class NotAcceptableError extends ClientError {
    constructor(input: HTTPErrorInput = {}) {
        const options: HTTPErrorOptions = typeof input === 'string' ? { message: input } : input;
        super({
            ...options,
            code: options.code ?? NotAcceptableErrorOptions.code,
            status: options.status ?? options.statusCode ?? NotAcceptableErrorOptions.status,
        });
    }
}
