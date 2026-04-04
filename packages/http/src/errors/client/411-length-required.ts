import { ClientError } from '../base';
import type { HTTPErrorInput, HTTPErrorOptions } from '../../types';

export const LengthRequiredErrorOptions = {
    code: 'LENGTH_REQUIRED',
    statusCode: 411,
    statusMessage: 'Length Required',
} as const;

export class LengthRequiredError extends ClientError {
    constructor(input: HTTPErrorInput = {}) {
        const options: HTTPErrorOptions = typeof input === 'string' ? { message: input } : input;
        super({
            ...options,
            code: options.code ?? LengthRequiredErrorOptions.code,
            statusCode: options.statusCode ?? LengthRequiredErrorOptions.statusCode,
            statusMessage: options.statusMessage ?? LengthRequiredErrorOptions.statusMessage,
        });
    }
}
