import { markInstanceof } from '@ebec/core';
import { ClientError } from '../base';
import type { HTTPErrorInput, HTTPErrorOptions } from '../../types';

export const PRECONDITION_FAILED_ERROR_INSTANCE = Symbol.for('@ebec/http/PreconditionFailedError');

export const PreconditionFailedErrorOptions = {
    code: 'PRECONDITION_FAILED',
    status: 412,
} as const;

export class PreconditionFailedError extends ClientError {
    constructor(input: HTTPErrorInput = {}) {
        const options: HTTPErrorOptions = typeof input === 'string' ? { message: input } : input;
        super({
            ...options,
            code: options.code ?? PreconditionFailedErrorOptions.code,
            status: options.status ?? options.statusCode ?? PreconditionFailedErrorOptions.status,
        });
        markInstanceof(this, PRECONDITION_FAILED_ERROR_INSTANCE);
    }
}
