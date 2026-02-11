import { ClientError } from '../base';
import type { Input } from '../../types';

export const UnorderedCollectionErrorOptions = {
    code: 'UNORDERED_COLLECTION',
    statusCode: 425,
    statusMessage: 'Unordered Collection',
} as const;

export class UnorderedCollectionError extends ClientError {
    constructor(...input: Input[]) {
        super(UnorderedCollectionErrorOptions, ...input);
    }
}
