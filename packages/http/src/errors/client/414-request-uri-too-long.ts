import { ClientError } from '../base';
import type { Input } from '../../types';

export const RequestURITooLongErrorOptions = {
    code: 'REQUEST_URI_TOO_LONG',
    statusCode: 414,
    statusMessage: 'Request-URI Too Long',
} as const;

export class RequestURITooLongError extends ClientError {
    constructor(...input: Input[]) {
        super(RequestURITooLongErrorOptions, ...input);
    }
}
