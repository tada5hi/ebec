import { ClientError } from '../base';
import type { ErrorInput, ErrorOptions } from '../../types';

export const LengthRequiredErrorOptions = {
    code: 'LENGTH_REQUIRED',
    statusCode: 411,
    statusMessage: 'Length Required',
} as const;

export class LengthRequiredError extends ClientError {
    constructor(input: ErrorInput = {}) {
        const options: ErrorOptions = typeof input === 'string' ? { message: input } : input;
        super({ ...LengthRequiredErrorOptions, ...options });
    }
}
