import {
    buildOptions,
    buildMessage,
    Options,
    mergeOptions
} from 'ebec';
import { ServerError } from '../base';

export const HTTPVersionNotSupportedErrorOptions : Options = {
    code: `HTTP_VERSION_NOT_SUPPORTED`,
    statusCode: 505,
    decorateMessage: true,
    logMessage: true
}

export class HTTPVersionNotSupportedError extends ServerError {
    constructor(data?: string | Error | Options, options?: Options) {
        options = mergeOptions(
            buildOptions(data, options),
            HTTPVersionNotSupportedErrorOptions
        );

        let message = buildMessage(data, options);
        if (!message) {
            message = `HTTP Version Not Supported`;
        }

        super(message, options);
    }
}
