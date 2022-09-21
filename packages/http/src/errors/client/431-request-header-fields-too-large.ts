import {
    buildOptions,
    buildMessage,
    Options,
    mergeOptions
} from 'ebec';
import { ClientError } from '../base';

export const RequestHeaderFieldsTooLargeErrorOptions : Options = {
    code: `REQUEST_HEADER_FIELDS_TOO_LARGE`,
    statusCode: 431,
    decorateMessage: false,
    logMessage: false
}

export class RequestHeaderFieldsTooLargeError extends ClientError {
    constructor(data?: string | Error | Options, options?: Options) {
        options = mergeOptions(
            buildOptions(data, options),
            RequestHeaderFieldsTooLargeErrorOptions
        );

        let message = buildMessage(data, options);
        if (!message) {
            message = `Request Header Fields Too Large`;
        }

        super(message, options);
    }
}
