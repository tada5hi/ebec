import { ServerError } from '../base';
import type { ErrorInput, ErrorOptions } from '../../types';

export const BandwidthLimitExceededErrorOptions = {
    code: 'BANDWIDTH_LIMIT_EXCEEDED',
    statusCode: 509,
    statusMessage: 'Bandwidth Limit Exceeded',
} as const;

export class BandwidthLimitExceededError extends ServerError {
    constructor(input: ErrorInput = {}) {
        const options: ErrorOptions = typeof input === 'string' ? { message: input } : input;
        super({
            ...options,
            code: options.code ?? BandwidthLimitExceededErrorOptions.code,
            statusCode: options.statusCode ?? BandwidthLimitExceededErrorOptions.statusCode,
            statusMessage: options.statusMessage ?? BandwidthLimitExceededErrorOptions.statusMessage,
        });
    }
}
