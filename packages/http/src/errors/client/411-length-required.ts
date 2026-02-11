import { ClientError } from '../base';
import type { Input } from '../../types';

export const LengthRequiredErrorOptions = {
    code: 'LENGTH_REQUIRED',
    statusCode: 411,
    statusMessage: 'Length Required',
} as const;

export class LengthRequiredError extends ClientError {
    constructor(...input: Input[]) {
        super(LengthRequiredErrorOptions, ...input);
    }
}
