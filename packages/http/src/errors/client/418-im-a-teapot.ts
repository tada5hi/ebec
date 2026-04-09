import { ClientError } from '../base';
import type { HTTPErrorInput, HTTPErrorOptions } from '../../types';

export const ImATeapotErrorOptions = {
    code: 'IM_A_TEAPOT',
    status: 418,
    statusMessage: 'I\'m a Teapot',
} as const;

export class ImATeapotError extends ClientError {
    constructor(input: HTTPErrorInput = {}) {
        const options: HTTPErrorOptions = typeof input === 'string' ? { message: input } : input;
        super({
            ...options,
            code: options.code ?? ImATeapotErrorOptions.code,
            status: options.status ?? options.statusCode ?? ImATeapotErrorOptions.status,
            statusMessage: options.statusMessage ?? ImATeapotErrorOptions.statusMessage,
        });
    }
}
