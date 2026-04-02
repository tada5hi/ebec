import { ClientError } from '../base';
import type { ErrorInput, ErrorOptions } from '../../types';

export const UpgradeRequiredErrorOptions = {
    code: 'UPGRADE_REQUIRED',
    statusCode: 426,
    statusMessage: 'Upgrade Required',
} as const;

export class UpgradeRequiredError extends ClientError {
    constructor(input: ErrorInput = {}) {
        const options: ErrorOptions = typeof input === 'string' ? { message: input } : input;
        super({
            ...options,
            code: options.code ?? UpgradeRequiredErrorOptions.code,
            statusCode: options.statusCode ?? UpgradeRequiredErrorOptions.statusCode,
            statusMessage: options.statusMessage ?? UpgradeRequiredErrorOptions.statusMessage,
        });
    }
}
