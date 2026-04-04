import { ServerError } from '../base';
import type { HTTPErrorInput, HTTPErrorOptions } from '../../types';

export const BadGatewayErrorOptions = {
    code: 'BAD_GATEWAY',
    statusCode: 502,
    statusMessage: 'Bad Gateway',
} as const;

export class BadGatewayError extends ServerError {
    constructor(input: HTTPErrorInput = {}) {
        const options: HTTPErrorOptions = typeof input === 'string' ? { message: input } : input;
        super({
            ...options,
            code: options.code ?? BadGatewayErrorOptions.code,
            statusCode: options.statusCode ?? BadGatewayErrorOptions.statusCode,
            statusMessage: options.statusMessage ?? BadGatewayErrorOptions.statusMessage,
        });
    }
}
