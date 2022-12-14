import {
    buildOptions,
    buildMessage,
    Options,
    mergeOptions
} from 'ebec';
import { ClientError } from '../base';

export const TooManyRequestsErrorOptions = {
    code: `TOO_MANY_REQUESTS`,
    statusCode: 429,
    decorateMessage: false,
    logMessage: false,
    message: `Too Many Requests`
} as const;

export class TooManyRequestsError extends ClientError {
    constructor(data?: string | Error | Options, options?: Options) {
        options = mergeOptions(
            buildOptions(data, options),
            TooManyRequestsErrorOptions
        );

        let message = buildMessage(data, options);
        if (!message) {
            message = `Too Many Requests`;
        }

        super(message, options);
    }
}
