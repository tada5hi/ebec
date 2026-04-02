import { ClientError } from '../base';
import type { ErrorInput, ErrorOptions } from '../../types';

export const PreconditionRequiredErrorOptions = {
    code: 'PRECONDITION_REQUIRED',
    statusCode: 428,
    statusMessage: 'Precondition Required',
} as const;

export class PreconditionRequiredError extends ClientError {
    constructor(input: ErrorInput = {}) {
        const options: ErrorOptions = typeof input === 'string' ? { message: input } : input;
        super({ ...PreconditionRequiredErrorOptions, ...options });
    }
}
