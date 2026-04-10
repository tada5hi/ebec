import { ClientError } from '../base';
import type { HTTPErrorInput, HTTPErrorOptions } from '../../types';

export const UnorderedCollectionErrorOptions = {
    code: 'UNORDERED_COLLECTION',
    status: 425,
} as const;

export class UnorderedCollectionError extends ClientError {
    constructor(input: HTTPErrorInput = {}) {
        const options: HTTPErrorOptions = typeof input === 'string' ? { message: input } : input;
        super({
            ...options,
            code: options.code ?? UnorderedCollectionErrorOptions.code,
            status: options.status ?? options.statusCode ?? UnorderedCollectionErrorOptions.status,
        });
    }
}
