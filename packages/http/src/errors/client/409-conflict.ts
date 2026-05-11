import { markInstanceof } from '@ebec/core';
import { ClientError } from '../base';
import type { HTTPErrorInput, HTTPErrorOptions } from '../../types';

export const CONFLICT_ERROR_INSTANCE = Symbol.for('@ebec/http/ConflictError');

export const ConflictErrorOptions = {
    code: 'CONFLICT',
    status: 409,
} as const;

export class ConflictError extends ClientError {
    constructor(input: HTTPErrorInput = {}) {
        const options: HTTPErrorOptions = typeof input === 'string' ? { message: input } : input;
        super({
            ...options,
            code: options.code ?? ConflictErrorOptions.code,
            status: options.status ?? options.statusCode ?? ConflictErrorOptions.status,
        });
        markInstanceof(this, CONFLICT_ERROR_INSTANCE);
    }
}
