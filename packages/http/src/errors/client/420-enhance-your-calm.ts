import { ClientError } from '../base';
import type { ErrorInput, ErrorOptions } from '../../types';

export const EnhanceYourCalmErrorOptions = {
    code: 'ENHANCE_YOUR_CALM',
    statusCode: 420,
    statusMessage: 'Enhance Your Calm',
} as const;

export class EnhanceYourCalmError extends ClientError {
    constructor(input: ErrorInput = {}) {
        const options: ErrorOptions = typeof input === 'string' ? { message: input } : input;
        super({
            ...options,
            code: options.code ?? EnhanceYourCalmErrorOptions.code,
            statusCode: options.statusCode ?? EnhanceYourCalmErrorOptions.statusCode,
            statusMessage: options.statusMessage ?? EnhanceYourCalmErrorOptions.statusMessage,
        });
    }
}
