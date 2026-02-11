import { ClientError } from '../base';
import type { Input } from '../../types';

export const PreconditionFailedErrorOptions = {
    code: 'PRECONDITION_FAILED',
    statusCode: 412,
    statusMessage: 'Precondition Failed',
} as const;

export class PreconditionFailedError extends ClientError {
    constructor(...input: Input[]) {
        super(PreconditionFailedErrorOptions, ...input);
    }
}
