import { ClientError } from '../base';
import type { ErrorInput, ErrorOptions } from '../../types';

export const UnsupportedMediaTypeErrorOptions = {
    code: 'UNSUPPORTED_MEDIA_TYPE',
    statusCode: 415,
    statusMessage: 'Unsupported Media Type',
} as const;

export class UnsupportedMediaTypeError extends ClientError {
    constructor(input: ErrorInput = {}) {
        const options: ErrorOptions = typeof input === 'string' ? { message: input } : input;
        super({
            ...options,
            code: options.code ?? UnsupportedMediaTypeErrorOptions.code,
            statusCode: options.statusCode ?? UnsupportedMediaTypeErrorOptions.statusCode,
            statusMessage: options.statusMessage ?? UnsupportedMediaTypeErrorOptions.statusMessage,
        });
    }
}
