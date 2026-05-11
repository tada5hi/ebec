import { markInstanceof } from '@ebec/core';
import { ClientError } from '../base';
import type { HTTPErrorInput, HTTPErrorOptions } from '../../types';

export const UNSUPPORTED_MEDIA_TYPE_ERROR_INSTANCE = Symbol.for('@ebec/http/UnsupportedMediaTypeError');

export const UnsupportedMediaTypeErrorOptions = {
    code: 'UNSUPPORTED_MEDIA_TYPE',
    status: 415,
} as const;

export class UnsupportedMediaTypeError extends ClientError {
    constructor(input: HTTPErrorInput = {}) {
        const options: HTTPErrorOptions = typeof input === 'string' ? { message: input } : input;
        super({
            ...options,
            code: options.code ?? UnsupportedMediaTypeErrorOptions.code,
            status: options.status ?? options.statusCode ?? UnsupportedMediaTypeErrorOptions.status,
        });
        markInstanceof(this, UNSUPPORTED_MEDIA_TYPE_ERROR_INSTANCE);
    }
}
