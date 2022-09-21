import {
    buildOptions,
    buildMessage,
    Options,
    setUnsetOptions
} from 'ebec';
import { ClientError } from '../base';

export const BlockedByWindowsParentalControlsErrorOptions : Options = {
    code: `BLOCKED_BY_WINDOWS_PARENTAL_CONTROLS`,
    statusCode: 450,
    decorateMessage: false,
    logMessage: false
}

export class BlockedByWindowsParentalControlsError extends ClientError {
    constructor(data?: string | Error | Options, options?: Options) {
        options = setUnsetOptions(
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
