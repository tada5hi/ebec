import { ClientError } from '../base';
import type { HTTPErrorInput, HTTPErrorOptions } from '../../types';

export const RequestedRangeNotSatisfiableErrorOptions = {
    code: 'REQUESTED_RANGE_NOT_SATISFIABLE',
    status: 416,
    statusMessage: 'Requested Range Not Satisfiable',
} as const;

export class RequestedRangeNotSatisfiableError extends ClientError {
    constructor(input: HTTPErrorInput = {}) {
        const options: HTTPErrorOptions = typeof input === 'string' ? { message: input } : input;
        super({
            ...options,
            code: options.code ?? RequestedRangeNotSatisfiableErrorOptions.code,
            status: options.status ?? options.statusCode ?? RequestedRangeNotSatisfiableErrorOptions.status,
            statusMessage: options.statusMessage ?? RequestedRangeNotSatisfiableErrorOptions.statusMessage,
        });
    }
}
