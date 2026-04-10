import { ServerError } from '../base';
import type { HTTPErrorInput, HTTPErrorOptions } from '../../types';

export const LoopDetectedErrorOptions = {
    code: 'LOOP_DETECTED',
    status: 508,
} as const;

export class LoopDetectedError extends ServerError {
    constructor(input: HTTPErrorInput = {}) {
        const options: HTTPErrorOptions = typeof input === 'string' ? { message: input } : input;
        super({
            ...options,
            code: options.code ?? LoopDetectedErrorOptions.code,
            status: options.status ?? options.statusCode ?? LoopDetectedErrorOptions.status,
        });
    }
}
