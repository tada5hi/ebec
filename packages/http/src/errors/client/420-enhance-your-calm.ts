import { ClientError } from '../base';
import type { HTTPErrorInput, HTTPErrorOptions } from '../../types';

export const EnhanceYourCalmErrorOptions = {
    code: 'ENHANCE_YOUR_CALM',
    statusCode: 420,
    statusMessage: 'Enhance Your Calm',
} as const;

export class EnhanceYourCalmError extends ClientError {
    constructor(input: HTTPErrorInput = {}) {
        const options: HTTPErrorOptions = typeof input === 'string' ? { message: input } : input;
        super({
            ...options,
            code: options.code ?? EnhanceYourCalmErrorOptions.code,
            statusCode: options.statusCode ?? EnhanceYourCalmErrorOptions.statusCode,
            statusMessage: options.statusMessage ?? EnhanceYourCalmErrorOptions.statusMessage,
        });
    }
}
