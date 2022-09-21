import {
    buildOptions,
    buildMessage,
    Options,
    setUnsetOptions
} from 'ebec';
import { ClientError } from '../base';

export const RequestTimeoutErrorOptions : Options = {
    code: `REQUEST_TIMEOUT`,
    statusCode: 408,
    decorateMessage: false,
    logMessage: false
}

export class RequestTimeoutError extends ClientError {
    constructor(data?: string | Error | Options, options?: Options) {
        options = setUnsetOptions(
            buildOptions(data, options),
            RequestTimeoutErrorOptions
        );

        let message = buildMessage(data, options);
        if (!message) {
            message = `Request Timeout`;
        }

        super(message, options);
    }
}
