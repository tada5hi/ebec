import { markInstanceof } from '@ebec/core';
import { ClientError } from '../base';
import type { HTTPErrorInput, HTTPErrorOptions } from '../../types';

export const EXPECTATION_FAILED_ERROR_INSTANCE = Symbol.for('@ebec/http/ExpectationFailedError');

export const ExpectationFailedErrorOptions = {
    code: 'EXPECTATION_FAILED',
    status: 417,
} as const;

export class ExpectationFailedError extends ClientError {
    constructor(input: HTTPErrorInput = {}) {
        const options: HTTPErrorOptions = typeof input === 'string' ? { message: input } : input;
        super({
            ...options,
            code: options.code ?? ExpectationFailedErrorOptions.code,
            status: options.status ?? options.statusCode ?? ExpectationFailedErrorOptions.status,
        });
        markInstanceof(this, EXPECTATION_FAILED_ERROR_INSTANCE);
    }
}
