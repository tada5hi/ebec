import { ClientError } from '../base';
import type { ErrorInput, ErrorOptions } from '../../types';

export const RequestHeaderFieldsTooLargeErrorOptions = {
    code: 'REQUEST_HEADER_FIELDS_TOO_LARGE',
    statusCode: 431,
    statusMessage: 'Request Header Fields Too Large',
} as const;

export class RequestHeaderFieldsTooLargeError extends ClientError {
    constructor(input: ErrorInput = {}) {
        const options: ErrorOptions = typeof input === 'string' ? { message: input } : input;
        super({
            ...options,
            code: options.code ?? RequestHeaderFieldsTooLargeErrorOptions.code,
            statusCode: options.statusCode ?? RequestHeaderFieldsTooLargeErrorOptions.statusCode,
            statusMessage: options.statusMessage ?? RequestHeaderFieldsTooLargeErrorOptions.statusMessage,
        });
    }
}
