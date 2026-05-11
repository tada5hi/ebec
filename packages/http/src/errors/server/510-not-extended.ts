import { markInstanceof } from '@ebec/core';
import { ServerError } from '../base';
import type { HTTPErrorInput, HTTPErrorOptions } from '../../types';

export const NOT_EXTENDED_ERROR_INSTANCE = Symbol.for('@ebec/http/NotExtendedError');

export const NotExtendedErrorOptions = {
    code: 'NOT_EXTENDED',
    status: 510,
} as const;

export class NotExtendedError extends ServerError {
    constructor(input: HTTPErrorInput = {}) {
        const options: HTTPErrorOptions = typeof input === 'string' ? { message: input } : input;
        super({
            ...options,
            code: options.code ?? NotExtendedErrorOptions.code,
            status: options.status ?? options.statusCode ?? NotExtendedErrorOptions.status,
        });
        markInstanceof(this, NOT_EXTENDED_ERROR_INSTANCE);
    }
}
