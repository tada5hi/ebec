import { ClientError } from '../base';
import type { Input } from '../../types';

export const LockedErrorOptions = {
    code: 'LOCKED',
    statusCode: 423,
    statusMessage: 'Locked',
} as const;

export class LockedError extends ClientError {
    constructor(...input: Input[]) {
        super(LockedErrorOptions, ...input);
    }
}
