import {
    buildOptions,
    buildMessage,
    Options,
    mergeOptions
} from 'ebec';
import { ServerError } from '../base';

export const BandwidthLimitExceededErrorOptions : Options = {
    code: `BANDWIDTH_LIMIT_EXCEEDED`,
    statusCode: 509,
    decorateMessage: true,
    logMessage: true
}

export class BandwidthLimitExceededError extends ServerError {
    constructor(data?: string | Error | Options, options?: Options) {
        options = mergeOptions(
            buildOptions(data, options),
            BandwidthLimitExceededErrorOptions
        );

        let message = buildMessage(data, options);
        if (!message) {
            message = `Bandwidth Limit Exceeded`;
        }

        super(message, options);
    }
}
