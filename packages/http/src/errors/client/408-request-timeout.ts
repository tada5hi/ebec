import { ClientError } from '../base';
import { Input } from '../../types';

export const RequestTimeoutErrorOptions = {
    code: `REQUEST_TIMEOUT`,
    statusCode: 408,
    statusMessage: `Request Timeout`
} as const;

export class RequestTimeoutError extends ClientError {
    constructor(...input: Input[]) {
        super(RequestTimeoutErrorOptions, ...input);
    }
}
