import {
    buildOptions,
    buildMessage,
    Options,
    mergeOptions
} from 'ebec';
import { ClientError } from '../base';
import { HTTPOptions } from '../../type';

export const RequestTimeoutErrorOptions : HTTPOptions = {
    code: `REQUEST_TIMEOUT`,
    statusCode: 408,
    decorateMessage: false,
    logMessage: false
}

export class RequestTimeoutError extends ClientError {
    constructor(data?: string | Error | Options, options?: Options) {
        options = mergeOptions(
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
