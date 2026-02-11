import { ClientError } from '../base';
import type { Input } from '../../types';

export const UpgradeRequiredErrorOptions = {
    code: 'UPGRADE_REQUIRED',
    statusCode: 426,
    statusMessage: 'Upgrade Required',
} as const;

export class UpgradeRequiredError extends ClientError {
    constructor(...input: Input[]) {
        super(UpgradeRequiredErrorOptions, ...input);
    }
}
