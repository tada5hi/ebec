import {
    buildOptions,
    buildMessage,
    Options,
    mergeOptions
} from 'ebec';
import { ClientError } from '../base';

export const RequestURITooLongErrorOptions = {
    code: `REQUEST_URI_TOO_LONG`,
    statusCode: 414,
    decorateMessage: false,
    logMessage: false,
    message: `Request-URI Too Long`
} as const;

export class RequestURITooLongError extends ClientError {
    constructor(data?: string | Error | Options, options?: Options) {
        options = mergeOptions(
            buildOptions(data, options),
            RequestURITooLongErrorOptions
        );

        let message = buildMessage(data, options);
        if (!message) {
            message = `Request-URI Too Long`;
        }

        super(message, options);
    }
}
