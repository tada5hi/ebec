import { ServerError } from '../base';
import type { HTTPErrorInput, HTTPErrorOptions } from '../../types';

export const VariantAlsoNegotiatesErrorOptions = {
    code: 'VARIANT_ALSO_NEGOTIATES',
    statusCode: 506,
    statusMessage: 'Variant Also Negotiates',
} as const;

export class VariantAlsoNegotiatesError extends ServerError {
    constructor(input: HTTPErrorInput = {}) {
        const options: HTTPErrorOptions = typeof input === 'string' ? { message: input } : input;
        super({
            ...options,
            code: options.code ?? VariantAlsoNegotiatesErrorOptions.code,
            statusCode: options.statusCode ?? VariantAlsoNegotiatesErrorOptions.statusCode,
            statusMessage: options.statusMessage ?? VariantAlsoNegotiatesErrorOptions.statusMessage,
        });
    }
}
