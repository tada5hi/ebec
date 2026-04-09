import { ServerError } from '../base';
import type { HTTPErrorInput, HTTPErrorOptions } from '../../types';

export const VariantAlsoNegotiatesErrorOptions = {
    code: 'VARIANT_ALSO_NEGOTIATES',
    status: 506,
} as const;

export class VariantAlsoNegotiatesError extends ServerError {
    constructor(input: HTTPErrorInput = {}) {
        const options: HTTPErrorOptions = typeof input === 'string' ? { message: input } : input;
        super({
            ...options,
            code: options.code ?? VariantAlsoNegotiatesErrorOptions.code,
            status: options.status ?? options.statusCode ?? VariantAlsoNegotiatesErrorOptions.status,
        });
    }
}
