import { ServerError } from '../base';
import type { ErrorInput, ErrorOptions } from '../../types';

export const BadGatewayErrorOptions = {
    code: 'BAD_GATEWAY',
    statusCode: 502,
    statusMessage: 'Bad Gateway',
} as const;

export class BadGatewayError extends ServerError {
    constructor(input: ErrorInput = {}) {
        const options: ErrorOptions = typeof input === 'string' ? { message: input } : input;
        super({
            ...options,
            code: options.code ?? BadGatewayErrorOptions.code,
            statusCode: options.statusCode ?? BadGatewayErrorOptions.statusCode,
            statusMessage: options.statusMessage ?? BadGatewayErrorOptions.statusMessage,
        });
    }
}
