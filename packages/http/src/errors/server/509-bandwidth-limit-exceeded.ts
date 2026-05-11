import { markInstanceof } from '@ebec/core';
import { ServerError } from '../base';
import type { HTTPErrorInput, HTTPErrorOptions } from '../../types';

export const BANDWIDTH_LIMIT_EXCEEDED_ERROR_INSTANCE = Symbol.for('@ebec/http/BandwidthLimitExceededError');

export const BandwidthLimitExceededErrorOptions = {
    code: 'BANDWIDTH_LIMIT_EXCEEDED',
    status: 509,
} as const;

export class BandwidthLimitExceededError extends ServerError {
    constructor(input: HTTPErrorInput = {}) {
        const options: HTTPErrorOptions = typeof input === 'string' ? { message: input } : input;
        super({
            ...options,
            code: options.code ?? BandwidthLimitExceededErrorOptions.code,
            status: options.status ?? options.statusCode ?? BandwidthLimitExceededErrorOptions.status,
        });
        markInstanceof(this, BANDWIDTH_LIMIT_EXCEEDED_ERROR_INSTANCE);
    }
}
