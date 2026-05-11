import { markInstanceof } from '@ebec/core';
import { ClientError } from '../base';
import type { HTTPErrorInput, HTTPErrorOptions } from '../../types';

export const RETRY_WITH_ERROR_INSTANCE = Symbol.for('@ebec/http/RetryWithError');

export const RetryWithErrorOptions = {
    code: 'RETRY_WITH',
    status: 449,
} as const;

export class RetryWithError extends ClientError {
    constructor(input: HTTPErrorInput = {}) {
        const options: HTTPErrorOptions = typeof input === 'string' ? { message: input } : input;
        super({
            ...options,
            code: options.code ?? RetryWithErrorOptions.code,
            status: options.status ?? options.statusCode ?? RetryWithErrorOptions.status,
        });
        markInstanceof(this, RETRY_WITH_ERROR_INSTANCE);
    }
}
