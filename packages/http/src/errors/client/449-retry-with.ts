import { ClientError } from '../base';
import { Input } from '../../types';

export const RetryWithErrorOptions = {
    code: `RETRY_WITH`,
    statusCode: 449,
    statusMessage: `Retry With`
} as const;

export class RetryWithError extends ClientError {
    constructor(...input: Input[]) {
        super(RetryWithErrorOptions, ...input);
    }
}
