import { ClientError } from '../base';
import { Input } from '../../types';

export const TooManyRequestsErrorOptions = {
    code: `TOO_MANY_REQUESTS`,
    statusCode: 429,
    statusMessage: `Too Many Requests`
} as const;

export class TooManyRequestsError extends ClientError {
    constructor(...input: Input[]) {
        super(TooManyRequestsErrorOptions, ...input);
    }
}
