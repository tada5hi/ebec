import { ClientError } from '../base';
import type { Input } from '../../types';

export const UnauthorizedErrorOptions = {
    code: 'UNAUTHORIZED',
    statusCode: 401,
    statusMessage: 'Unauthorized',
} as const;

export class UnauthorizedError extends ClientError {
    constructor(...input: Input[]) {
        super(UnauthorizedErrorOptions, ...input);
    }
}
