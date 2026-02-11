import { ServerError } from '../base';
import type { Input } from '../../types';

export const LoopDetectedErrorOptions = {
    code: 'LOOP_DETECTED',
    statusCode: 508,
    statusMessage: 'Loop Detected',
} as const;

export class LoopDetectedError extends ServerError {
    constructor(...input: Input[]) {
        super(LoopDetectedErrorOptions, ...input);
    }
}
