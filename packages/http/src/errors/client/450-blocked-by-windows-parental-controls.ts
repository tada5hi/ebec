import {
    buildOptions,
    buildMessage,
    Options,
    mergeOptions
} from 'ebec';
import { ClientError } from '../base';

export const BlockedByWindowsParentalControlsErrorOptions = {
    code: `BLOCKED_BY_WINDOWS_PARENTAL_CONTROLS`,
    statusCode: 450,
    decorateMessage: false,
    logMessage: false,
    message: `Blocked By Windows Parental Controls`
} as const;

export class BlockedByWindowsParentalControlsError extends ClientError {
    constructor(data?: string | Error | Options, options?: Options) {
        options = mergeOptions(
            buildOptions(data, options),
            BlockedByWindowsParentalControlsErrorOptions
        );

        let message = buildMessage(data, options);
        if (!message) {
            message = `Blocked By Windows Parental Controls`;
        }

        super(message, options);
    }
}
