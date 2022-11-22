import {
    buildOptions,
    buildMessage,
    Options,
    mergeOptions
} from 'ebec';
import { ServerError } from '../base';

export const NetworkAuthenticationRequiredErrorOptions = {
    code: `NETWORK_AUTHENTICATION_REQUIRED`,
    statusCode: 511,
    decorateMessage: true,
    logMessage: true,
    message: `Network Authentication Required`
} as const;

export class NetworkAuthenticationRequiredError extends ServerError {
    constructor(data?: string | Error | Options, options?: Options) {
        options = mergeOptions(
            buildOptions(data, options),
            NetworkAuthenticationRequiredErrorOptions
        );

        let message = buildMessage(data, options);
        if (!message) {
            message = `Network Authentication Required`;
        }

        super(message, options);
    }
}
