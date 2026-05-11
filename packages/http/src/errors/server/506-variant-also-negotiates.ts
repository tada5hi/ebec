import { markInstanceof } from '@ebec/core';
import { ServerError } from '../base';
import type { HTTPErrorInput, HTTPErrorOptions } from '../../types';

export const VARIANT_ALSO_NEGOTIATES_ERROR_INSTANCE = Symbol.for('@ebec/http/VariantAlsoNegotiatesError');

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
        markInstanceof(this, VARIANT_ALSO_NEGOTIATES_ERROR_INSTANCE);
    }
}
