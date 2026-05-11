import { markInstanceof } from '@ebec/core';
import { ClientError } from '../base';
import type { HTTPErrorInput, HTTPErrorOptions } from '../../types';

export const FORBIDDEN_ERROR_INSTANCE = Symbol.for('@ebec/http/ForbiddenError');

export const ForbiddenErrorOptions = {
    code: 'FORBIDDEN',
    status: 403,
} as const;

export class ForbiddenError extends ClientError {
    constructor(input: HTTPErrorInput = {}) {
        const options: HTTPErrorOptions = typeof input === 'string' ? { message: input } : input;
        super({
            ...options,
            code: options.code ?? ForbiddenErrorOptions.code,
            status: options.status ?? options.statusCode ?? ForbiddenErrorOptions.status,
        });
        markInstanceof(this, FORBIDDEN_ERROR_INSTANCE);
    }
}
