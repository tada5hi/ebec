import { ClientError } from '../base';
import type { HTTPErrorInput, HTTPErrorOptions } from '../../types';

export const BlockedByWindowsParentalControlsErrorOptions = {
    code: 'BLOCKED_BY_WINDOWS_PARENTAL_CONTROLS',
    status: 450,
    statusMessage: 'Blocked By Windows Parental Controls',
} as const;

export class BlockedByWindowsParentalControlsError extends ClientError {
    constructor(input: HTTPErrorInput = {}) {
        const options: HTTPErrorOptions = typeof input === 'string' ? { message: input } : input;
        super({
            ...options,
            code: options.code ?? BlockedByWindowsParentalControlsErrorOptions.code,
            status: options.status ?? options.statusCode ?? BlockedByWindowsParentalControlsErrorOptions.status,
            statusMessage: options.statusMessage ?? BlockedByWindowsParentalControlsErrorOptions.statusMessage,
        });
    }
}
