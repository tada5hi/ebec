import { markInstanceof } from '@ebec/core';
import { ServerError } from '../base';
import type { HTTPErrorInput, HTTPErrorOptions } from '../../types';

export const LOOP_DETECTED_ERROR_INSTANCE = Symbol.for('@ebec/http/LoopDetectedError');

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
        markInstanceof(this, LOOP_DETECTED_ERROR_INSTANCE);
    }
}
