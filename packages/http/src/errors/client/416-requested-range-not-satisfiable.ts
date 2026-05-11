import { markInstanceof } from '@ebec/core';
import { ClientError } from '../base';
import type { HTTPErrorInput, HTTPErrorOptions } from '../../types';

export const REQUESTED_RANGE_NOT_SATISFIABLE_ERROR_INSTANCE = Symbol.for('@ebec/http/RequestedRangeNotSatisfiableError');

export const RequestedRangeNotSatisfiableErrorOptions = {
    code: 'REQUESTED_RANGE_NOT_SATISFIABLE',
    status: 416,
} as const;

export class RequestedRangeNotSatisfiableError extends ClientError {
    constructor(input: HTTPErrorInput = {}) {
        const options: HTTPErrorOptions = typeof input === 'string' ? { message: input } : input;
        super({
            ...options,
            code: options.code ?? RequestedRangeNotSatisfiableErrorOptions.code,
            status: options.status ?? options.statusCode ?? RequestedRangeNotSatisfiableErrorOptions.status,
        });
        markInstanceof(this, REQUESTED_RANGE_NOT_SATISFIABLE_ERROR_INSTANCE);
    }
}
