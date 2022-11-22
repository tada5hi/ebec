import {
    buildOptions,
    buildMessage,
    Options,
    mergeOptions
} from 'ebec';
import { ServerError } from '../base';

export const BandwidthLimitExceededErrorOptions = {
    code: `BANDWIDTH_LIMIT_EXCEEDED`,
    statusCode: 509,
    decorateMessage: true,
    logMessage: true,
    message: `Bandwidth Limit Exceeded`
} as const;

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
