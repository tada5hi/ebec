import { ServerError } from '../base';
import type { HTTPErrorInput, HTTPErrorOptions } from '../../types';

export const LoopDetectedErrorOptions = {
    code: 'LOOP_DETECTED',
    statusCode: 508,
    statusMessage: 'Loop Detected',
} as const;

export class LoopDetectedError extends ServerError {
    constructor(input: HTTPErrorInput = {}) {
        const options: HTTPErrorOptions = typeof input === 'string' ? { message: input } : input;
        super({
            ...options,
            code: options.code ?? LoopDetectedErrorOptions.code,
            statusCode: options.statusCode ?? LoopDetectedErrorOptions.statusCode,
            statusMessage: options.statusMessage ?? LoopDetectedErrorOptions.statusMessage,
        });
    }
}
