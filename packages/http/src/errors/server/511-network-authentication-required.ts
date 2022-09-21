import {
    buildOptions,
    buildMessage,
    Options,
    setUnsetOptions
} from 'ebec';
import { ServerError } from '../base';

export const NetworkAuthenticationRequiredErrorOptions : Options = {
    code: `NETWORK_AUTHENTICATION_REQUIRED`,
    statusCode: 511,
    decorateMessage: true,
    logMessage: true
}

export class NetworkAuthenticationRequiredError extends ServerError {
    constructor(data?: string | Error | Options, options?: Options) {
        options = setUnsetOptions(
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
