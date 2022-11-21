import {
    buildOptions,
    buildMessage,
    Options,
    mergeOptions
} from 'ebec';
import { ClientError } from '../base';
import { HTTPOptions } from '../../type';

export const UpgradeRequiredErrorOptions : HTTPOptions = {
    code: `UPGRADE_REQUIRED`,
    statusCode: 426,
    decorateMessage: false,
    logMessage: false
}

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
