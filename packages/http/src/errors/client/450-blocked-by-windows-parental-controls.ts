import { ClientError } from '../base';
import type { HTTPErrorInput, HTTPErrorOptions } from '../../types';

export const BlockedByWindowsParentalControlsErrorOptions = {
    code: 'BLOCKED_BY_WINDOWS_PARENTAL_CONTROLS',
    status: 450,
} as const;

export class BlockedByWindowsParentalControlsError extends ClientError {
    constructor(input: HTTPErrorInput = {}) {
        const options: HTTPErrorOptions = typeof input === 'string' ? { message: input } : input;
        super({
            ...options,
            code: options.code ?? BlockedByWindowsParentalControlsErrorOptions.code,
            status: options.status ?? options.statusCode ?? BlockedByWindowsParentalControlsErrorOptions.status,
        });
    }
}
