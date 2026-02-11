import { ServerError } from '../base';
import type { Input } from '../../types';

export const HTTPVersionNotSupportedErrorOptions = {
    code: 'HTTP_VERSION_NOT_SUPPORTED',
    statusCode: 505,
    statusMessage: 'HTTP Version Not Supported',
} as const;

export class HTTPVersionNotSupportedError extends ServerError {
    constructor(...input: Input[]) {
        super(HTTPVersionNotSupportedErrorOptions, ...input);
    }
}
