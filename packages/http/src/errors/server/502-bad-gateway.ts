import {
    buildOptions,
    buildMessage,
    Options,
    setUnsetOptions
} from 'ebec';
import { ServerError } from '../base';

export const BadGatewayErrorOptions : Options = {
    code: `BAD_GATEWAY`,
    statusCode: 502,
    decorateMessage: true,
    logMessage: true
}

export class BadGatewayError extends ServerError {
    constructor(data?: string | Error | Options, options?: Options) {
        options = setUnsetOptions(
            buildOptions(data, options),
            BadGatewayErrorOptions
        );

        let message = buildMessage(data, options);
        if (!message) {
            message = `Bad Gateway`;
        }

        super(message, options);
    }
}
