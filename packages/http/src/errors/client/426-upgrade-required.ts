import {
    buildOptions,
    buildMessage,
    Options,
    mergeOptions
} from 'ebec';
import { ClientError } from '../base';

export const UpgradeRequiredErrorOptions = {
    code: `UPGRADE_REQUIRED`,
    statusCode: 426,
    decorateMessage: false,
    logMessage: false,
    message: `Upgrade Required`
} as const;

export class UpgradeRequiredError extends ClientError {
    constructor(data?: string | Error | Options, options?: Options) {
        options = mergeOptions(
            buildOptions(data, options),
            UpgradeRequiredErrorOptions
        );

        let message = buildMessage(data, options);
        if (!message) {
            message = `Upgrade Required`;
        }

        super(message, options);
    }
}
