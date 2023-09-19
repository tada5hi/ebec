import { ClientError } from '../base';
import { Input } from '../../types';

export const PreconditionRequiredErrorOptions = {
    code: `PRECONDITION_REQUIRED`,
    statusCode: 428,
    statusMessage: `Precondition Required`
} as const;

export class PreconditionRequiredError extends ClientError {
    constructor(...input: Input[]) {
        super(PreconditionRequiredErrorOptions, ...input);
    }
}
