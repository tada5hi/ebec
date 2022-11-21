import {
    buildOptions,
    buildMessage,
    Options,
    mergeOptions
} from 'ebec';
import { ServerError } from '../base';
import { HTTPOptions } from '../../type';

export const GatewayTimeoutErrorOptions : HTTPOptions = {
    code: `GATEWAY_TIMEOUT`,
    statusCode: 504,
    decorateMessage: true,
    logMessage: true
}

export class GatewayTimeoutError extends ServerError {
    constructor(data?: string | Error | Options, options?: Options) {
        options = mergeOptions(
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
