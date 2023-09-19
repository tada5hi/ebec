import { ClientError } from '../base';
import { Input } from '../../types';

export const ConflictErrorOptions = {
    code: `CONFLICT`,
    statusCode: 409,
    statusMessage: `Conflict`
} as const;

export class ConflictError extends ClientError {
    constructor(...input: Input[]) {
        super(ConflictErrorOptions, ...input);
    }
}
