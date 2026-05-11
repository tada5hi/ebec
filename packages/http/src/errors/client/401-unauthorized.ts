import { markInstanceof } from '@ebec/core';
import { ClientError } from '../base';
import type { HTTPErrorInput, HTTPErrorOptions } from '../../types';

export const UNAUTHORIZED_ERROR_INSTANCE = Symbol.for('@ebec/http/UnauthorizedError');

export const UnauthorizedErrorOptions = {
    code: 'UNAUTHORIZED',
    status: 401,
} as const;

export class UnauthorizedError extends ClientError {
    constructor(input: HTTPErrorInput = {}) {
        const options: HTTPErrorOptions = typeof input === 'string' ? { message: input } : input;
        super({
            ...options,
            code: options.code ?? UnauthorizedErrorOptions.code,
            status: options.status ?? options.statusCode ?? UnauthorizedErrorOptions.status,
        });
        markInstanceof(this, UNAUTHORIZED_ERROR_INSTANCE);
    }
}
