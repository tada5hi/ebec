import { ServerError } from '../base';
import type { HTTPErrorInput, HTTPErrorOptions } from '../../types';

export const BandwidthLimitExceededErrorOptions = {
    code: 'BANDWIDTH_LIMIT_EXCEEDED',
    statusCode: 509,
    statusMessage: 'Bandwidth Limit Exceeded',
} as const;

export class BandwidthLimitExceededError extends ServerError {
    constructor(input: HTTPErrorInput = {}) {
        const options: HTTPErrorOptions = typeof input === 'string' ? { message: input } : input;
        super({
            ...options,
            code: options.code ?? BandwidthLimitExceededErrorOptions.code,
            statusCode: options.statusCode ?? BandwidthLimitExceededErrorOptions.statusCode,
            statusMessage: options.statusMessage ?? BandwidthLimitExceededErrorOptions.statusMessage,
        });
    }
}
