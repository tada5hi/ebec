import { ClientError } from '../base';
import type { ErrorInput, ErrorOptions } from '../../types';

export const UnorderedCollectionErrorOptions = {
    code: 'UNORDERED_COLLECTION',
    statusCode: 425,
    statusMessage: 'Unordered Collection',
} as const;

export class UnorderedCollectionError extends ClientError {
    constructor(input: ErrorInput = {}) {
        const options: ErrorOptions = typeof input === 'string' ? { message: input } : input;
        super({
            ...options,
            code: options.code ?? UnorderedCollectionErrorOptions.code,
            statusCode: options.statusCode ?? UnorderedCollectionErrorOptions.statusCode,
            statusMessage: options.statusMessage ?? UnorderedCollectionErrorOptions.statusMessage,
        });
    }
}
