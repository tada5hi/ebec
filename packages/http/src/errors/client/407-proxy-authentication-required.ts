import {
    buildOptions,
    buildMessage,
    Options,
    mergeOptions
} from 'ebec';
import { ClientError } from '../base';

export const ProxyAuthenticationRequiredErrorOptions = {
    code: `PROXY_AUTHENTICATION_REQUIRED`,
    statusCode: 407,
    decorateMessage: false,
    logMessage: false,
    message: `Proxy Authentication Required`
} as const;

export class ProxyAuthenticationRequiredError extends ClientError {
    constructor(data?: string | Error | Options, options?: Options) {
        options = mergeOptions(
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
