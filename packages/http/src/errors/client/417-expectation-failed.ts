import { ClientError } from '../base';
import type { ErrorInput, ErrorOptions } from '../../types';

export const ExpectationFailedErrorOptions = {
    code: 'EXPECTATION_FAILED',
    statusCode: 417,
    statusMessage: 'Expectation Failed',
} as const;

export class ExpectationFailedError extends ClientError {
    constructor(input: ErrorInput = {}) {
        const options: ErrorOptions = typeof input === 'string' ? { message: input } : input;
        super({ ...ExpectationFailedErrorOptions, ...options });
    }
}
