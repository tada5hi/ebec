import {
    buildOptions,
    buildMessage,
    Options,
    setUnsetOptions
} from 'ebec';
import { ClientError } from '../base';

export const ClientClosedRequestErrorOptions : Options = {
    code: `CLIENT_CLOSED_REQUEST`,
    statusCode: 499,
    decorateMessage: false,
    logMessage: false
}

export class ClientClosedRequestError extends ClientError {
    constructor(data?: string | Error | Options, options?: Options) {
        options = setUnsetOptions(
            buildOptions(data, options),
            ClientClosedRequestErrorOptions
        );

        let message = buildMessage(data, options);
        if (!message) {
            message = `Client Closed Request`;
        }

        super(message, options);
    }
}
