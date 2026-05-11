import { markInstanceof } from '@ebec/core';
import { ClientError } from '../base';
import type { HTTPErrorInput, HTTPErrorOptions } from '../../types';

export const LOCKED_ERROR_INSTANCE = Symbol.for('@ebec/http/LockedError');

export const LockedErrorOptions = {
    code: 'LOCKED',
    status: 423,
} as const;

export class LockedError extends ClientError {
    constructor(input: HTTPErrorInput = {}) {
        const options: HTTPErrorOptions = typeof input === 'string' ? { message: input } : input;
        super({
            ...options,
            code: options.code ?? LockedErrorOptions.code,
            status: options.status ?? options.statusCode ?? LockedErrorOptions.status,
        });
        markInstanceof(this, LOCKED_ERROR_INSTANCE);
    }
}
