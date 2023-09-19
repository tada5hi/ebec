import { ClientError } from '../base';
import { Input } from '../../types';

export const RequestHeaderFieldsTooLargeErrorOptions = {
    code: `REQUEST_HEADER_FIELDS_TOO_LARGE`,
    statusCode: 431,
    statusMessage: `Request Header Fields Too Large`
} as const;

export class RequestHeaderFieldsTooLargeError extends ClientError {
    constructor(...input: Input[]) {
        super(RequestHeaderFieldsTooLargeErrorOptions, ...input);
    }
}
