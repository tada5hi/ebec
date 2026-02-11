import { ServerError } from '../base';
import type { Input } from '../../types';

export const VariantAlsoNegotiatesErrorOptions = {
    code: 'VARIANT_ALSO_NEGOTIATES',
    statusCode: 506,
    statusMessage: 'Variant Also Negotiates',
} as const;

export class VariantAlsoNegotiatesError extends ServerError {
    constructor(...input: Input[]) {
        super(VariantAlsoNegotiatesErrorOptions, ...input);
    }
}
