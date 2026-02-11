import { ClientError } from '../base';
import type { Input } from '../../types';

export const ForbiddenErrorOptions = {
    code: 'FORBIDDEN',
    statusCode: 403,
    statusMessage: 'Forbidden',
} as const;

export class ForbiddenError extends ClientError {
    constructor(...input: Input[]) {
        super(ForbiddenErrorOptions, ...input);
    }
}
