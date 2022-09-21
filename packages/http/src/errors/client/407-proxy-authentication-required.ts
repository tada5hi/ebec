import {
    buildOptions,
    buildMessage,
    Options,
    setUnsetOptions
} from 'ebec';
import { ClientError } from '../base';

export const ProxyAuthenticationRequiredErrorOptions : Options = {
    code: `PROXY_AUTHENTICATION_REQUIRED`,
    statusCode: 407,
    decorateMessage: false,
    logMessage: false
}

export class ProxyAuthenticationRequiredError extends ClientError {
    constructor(data?: string | Error | Options, options?: Options) {
        options = setUnsetOptions(
            buildOptions(data, options),
            ProxyAuthenticationRequiredErrorOptions
        );

        let message = buildMessage(data, options);
        if (!message) {
            message = `Proxy Authentication Required`;
        }

        super(message, options);
    }
}
