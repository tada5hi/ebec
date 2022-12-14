import {
    buildOptions,
    buildMessage,
    Options,
    mergeOptions
} from 'ebec';
import { ServerError } from '../base';

export const HTTPVersionNotSupportedErrorOptions = {
    code: `HTTP_VERSION_NOT_SUPPORTED`,
    statusCode: 505,
    decorateMessage: true,
    logMessage: true,
    message: `HTTP Version Not Supported`
} as const;

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
