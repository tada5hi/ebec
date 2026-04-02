import { ServerError } from '../base';
import type { ErrorInput, ErrorOptions } from '../../types';

export const LoopDetectedErrorOptions = {
    code: 'LOOP_DETECTED',
    statusCode: 508,
    statusMessage: 'Loop Detected',
} as const;

export class LoopDetectedError extends ServerError {
    constructor(input: ErrorInput = {}) {
        const options: ErrorOptions = typeof input === 'string' ? { message: input } : input;
        super({ ...LoopDetectedErrorOptions, ...options });
    }
}
