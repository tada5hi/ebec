import { ClientError } from '../base';
import type { ErrorInput, ErrorOptions } from '../../types';

export const ImATeapotErrorOptions = {
    code: 'IM_A_TEAPOT',
    statusCode: 418,
    statusMessage: 'I\'m a Teapot',
} as const;

export class ImATeapotError extends ClientError {
    constructor(input: ErrorInput = {}) {
        const options: ErrorOptions = typeof input === 'string' ? { message: input } : input;
        super({
            ...options,
            code: options.code ?? ImATeapotErrorOptions.code,
            statusCode: options.statusCode ?? ImATeapotErrorOptions.statusCode,
            statusMessage: options.statusMessage ?? ImATeapotErrorOptions.statusMessage,
        });
    }
}
