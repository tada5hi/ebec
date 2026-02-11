import { ClientError } from '../base';
import type { Input } from '../../types';

export const NotAcceptableErrorOptions = {
    code: 'NOT_ACCEPTABLE',
    statusCode: 406,
    statusMessage: 'Not Acceptable',
} as const;

export class NotAcceptableError extends ClientError {
    constructor(...input: Input[]) {
        super(NotAcceptableErrorOptions, ...input);
    }
}
