import {
    buildOptions,
    buildMessage,
    Options,
    setUnsetOptions
} from 'ebec';
import { ClientError } from '../base';

export const TooManyRequestsErrorOptions : Options = {
    code: `TOO_MANY_REQUESTS`,
    statusCode: 429,
    decorateMessage: false,
    logMessage: false
}

export class TooManyRequestsError extends ClientError {
    constructor(data?: string | Error | Options, options?: Options) {
        options = setUnsetOptions(
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
