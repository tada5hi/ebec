import { ClientError } from '../base';
import type { HTTPErrorInput, HTTPErrorOptions } from '../../types';

export const EnhanceYourCalmErrorOptions = {
    code: 'ENHANCE_YOUR_CALM',
    status: 420,
} as const;

export class EnhanceYourCalmError extends ClientError {
    constructor(input: HTTPErrorInput = {}) {
        const options: HTTPErrorOptions = typeof input === 'string' ? { message: input } : input;
        super({
            ...options,
            code: options.code ?? EnhanceYourCalmErrorOptions.code,
            status: options.status ?? options.statusCode ?? EnhanceYourCalmErrorOptions.status,
        });
    }
}
