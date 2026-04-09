import { ClientError } from '../base';
import type { HTTPErrorInput, HTTPErrorOptions } from '../../types';

export const UpgradeRequiredErrorOptions = {
    code: 'UPGRADE_REQUIRED',
    status: 426,
    statusMessage: 'Upgrade Required',
} as const;

export class UpgradeRequiredError extends ClientError {
    constructor(input: HTTPErrorInput = {}) {
        const options: HTTPErrorOptions = typeof input === 'string' ? { message: input } : input;
        super({
            ...options,
            code: options.code ?? UpgradeRequiredErrorOptions.code,
            status: options.status ?? options.statusCode ?? UpgradeRequiredErrorOptions.status,
            statusMessage: options.statusMessage ?? UpgradeRequiredErrorOptions.statusMessage,
        });
    }
}
