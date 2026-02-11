import { ClientError } from '../base';
import type { Input } from '../../types';

export const ExpectationFailedErrorOptions = {
    code: 'EXPECTATION_FAILED',
    statusCode: 417,
    statusMessage: 'Expectation Failed',
} as const;

export class ExpectationFailedError extends ClientError {
    constructor(...input: Input[]) {
        super(ExpectationFailedErrorOptions, ...input);
    }
}
