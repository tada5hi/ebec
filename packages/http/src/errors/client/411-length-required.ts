import { ClientError } from '../base';
import type { HTTPErrorInput, HTTPErrorOptions } from '../../types';

export const LengthRequiredErrorOptions = {
    code: 'LENGTH_REQUIRED',
    status: 411,
    statusMessage: 'Length Required',
} as const;

export class LengthRequiredError extends ClientError {
    constructor(input: HTTPErrorInput = {}) {
        const options: HTTPErrorOptions = typeof input === 'string' ? { message: input } : input;
        super({
            ...options,
            code: options.code ?? LengthRequiredErrorOptions.code,
            status: options.status ?? options.statusCode ?? LengthRequiredErrorOptions.status,
            statusMessage: options.statusMessage ?? LengthRequiredErrorOptions.statusMessage,
        });
    }
}
