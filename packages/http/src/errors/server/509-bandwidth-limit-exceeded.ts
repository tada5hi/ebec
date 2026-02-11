import { ServerError } from '../base';
import type { Input } from '../../types';

export const BandwidthLimitExceededErrorOptions = {
    code: 'BANDWIDTH_LIMIT_EXCEEDED',
    statusCode: 509,
    statusMessage: 'Bandwidth Limit Exceeded',
} as const;

export class BandwidthLimitExceededError extends ServerError {
    constructor(...input: Input[]) {
        super(BandwidthLimitExceededErrorOptions, ...input);
    }
}
