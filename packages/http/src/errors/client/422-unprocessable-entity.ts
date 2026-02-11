import { ClientError } from '../base';
import type { Input } from '../../types';

export const UnprocessableEntityErrorOptions = {
    code: 'UNPROCESSABLE_ENTITY',
    statusCode: 422,
    statusMessage: 'Unprocessable Entity',
} as const;

export class UnprocessableEntityError extends ClientError {
    constructor(...input: Input[]) {
        super(UnprocessableEntityErrorOptions, ...input);
    }
}
