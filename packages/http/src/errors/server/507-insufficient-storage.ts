import { ServerError } from '../base';
import type { Input } from '../../types';

export const InsufficientStorageErrorOptions = {
    code: 'INSUFFICIENT_STORAGE',
    statusCode: 507,
    statusMessage: 'Insufficient Storage',
} as const;

export class InsufficientStorageError extends ServerError {
    constructor(...input: Input[]) {
        super(InsufficientStorageErrorOptions, ...input);
    }
}
