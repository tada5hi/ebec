import { ServerError } from '../base';
import type { ErrorInput, ErrorOptions } from '../../types';

export const VariantAlsoNegotiatesErrorOptions = {
    code: 'VARIANT_ALSO_NEGOTIATES',
    statusCode: 506,
    statusMessage: 'Variant Also Negotiates',
} as const;

export class VariantAlsoNegotiatesError extends ServerError {
    constructor(input: ErrorInput = {}) {
        const options: ErrorOptions = typeof input === 'string' ? { message: input } : input;
        super({
            ...options,
            code: options.code ?? VariantAlsoNegotiatesErrorOptions.code,
            statusCode: options.statusCode ?? VariantAlsoNegotiatesErrorOptions.statusCode,
            statusMessage: options.statusMessage ?? VariantAlsoNegotiatesErrorOptions.statusMessage,
        });
    }
}
