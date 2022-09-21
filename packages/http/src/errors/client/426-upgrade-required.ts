import {
    buildOptions,
    buildMessage,
    Options,
    setUnsetOptions
} from 'ebec';
import { ClientError } from '../base';

export const UpgradeRequiredErrorOptions : Options = {
    code: `UPGRADE_REQUIRED`,
    statusCode: 426,
    decorateMessage: false,
    logMessage: false
}

export class UpgradeRequiredError extends ClientError {
    constructor(data?: string | Error | Options, options?: Options) {
        options = setUnsetOptions(
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
