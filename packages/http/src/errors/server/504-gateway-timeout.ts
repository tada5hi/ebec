import {
    buildOptions,
    buildMessage,
    Options,
    setUnsetOptions
} from 'ebec';
import { ServerError } from '../base';

export const GatewayTimeoutErrorOptions : Options = {
    code: `GATEWAY_TIMEOUT`,
    statusCode: 504,
    decorateMessage: true,
    logMessage: true
}

export class GatewayTimeoutError extends ServerError {
    constructor(data?: string | Error | Options, options?: Options) {
        options = setUnsetOptions(
            buildOptions(data, options),
            GatewayTimeoutErrorOptions
        );

        let message = buildMessage(data, options);
        if (!message) {
            message = `Gateway Timeout`;
        }

        super(message, options);
    }
}
