import { ClientError } from '../base';
import type { ErrorInput, ErrorOptions } from '../../types';

export const RequestedRangeNotSatisfiableErrorOptions = {
    code: 'REQUESTED_RANGE_NOT_SATISFIABLE',
    statusCode: 416,
    statusMessage: 'Requested Range Not Satisfiable',
} as const;

export class RequestedRangeNotSatisfiableError extends ClientError {
    constructor(input: ErrorInput = {}) {
        const options: ErrorOptions = typeof input === 'string' ? { message: input } : input;
        super({ ...RequestedRangeNotSatisfiableErrorOptions, ...options });
    }
}
