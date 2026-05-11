import { markInstanceof } from '@ebec/core';
import { ServerError } from '../base';
import type { HTTPErrorInput, HTTPErrorOptions } from '../../types';

export const NOT_IMPLEMENTED_ERROR_INSTANCE = Symbol.for('@ebec/http/NotImplementedError');

export const NotImplementedErrorOptions = {
    code: 'NOT_IMPLEMENTED',
    status: 501,
} as const;

export class NotImplementedError extends ServerError {
    constructor(input: HTTPErrorInput = {}) {
        const options: HTTPErrorOptions = typeof input === 'string' ? { message: input } : input;
        super({
            ...options,
            code: options.code ?? NotImplementedErrorOptions.code,
            status: options.status ?? options.statusCode ?? NotImplementedErrorOptions.status,
        });
        markInstanceof(this, NOT_IMPLEMENTED_ERROR_INSTANCE);
    }
}
