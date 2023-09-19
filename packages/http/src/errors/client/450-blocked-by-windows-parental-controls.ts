import { ClientError } from '../base';
import { Input } from '../../types';

export const BlockedByWindowsParentalControlsErrorOptions = {
    code: `BLOCKED_BY_WINDOWS_PARENTAL_CONTROLS`,
    statusCode: 450,
    statusMessage: `Blocked By Windows Parental Controls`
} as const;

export class BlockedByWindowsParentalControlsError extends ClientError {
    constructor(...input: Input[]) {
        super(BlockedByWindowsParentalControlsErrorOptions, ...input);
    }
}
