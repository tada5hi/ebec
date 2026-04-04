import { ClientError } from '../base';
import type { HTTPErrorInput, HTTPErrorOptions } from '../../types';

export const NotAcceptableErrorOptions = {
    code: 'NOT_ACCEPTABLE',
    statusCode: 406,
    statusMessage: 'Not Acceptable',
} as const;

export class NotAcceptableError extends ClientError {
    constructor(input: HTTPErrorInput = {}) {
        const options: HTTPErrorOptions = typeof input === 'string' ? { message: input } : input;
        super({
            ...options,
            code: options.code ?? NotAcceptableErrorOptions.code,
            statusCode: options.statusCode ?? NotAcceptableErrorOptions.statusCode,
            statusMessage: options.statusMessage ?? NotAcceptableErrorOptions.statusMessage,
        });
    }
}
