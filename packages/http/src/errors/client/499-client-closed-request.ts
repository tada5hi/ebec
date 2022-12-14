import {
    buildOptions,
    buildMessage,
    Options,
    mergeOptions
} from 'ebec';
import { ClientError } from '../base';

export const ClientClosedRequestErrorOptions = {
    code: `CLIENT_CLOSED_REQUEST`,
    statusCode: 499,
    decorateMessage: false,
    logMessage: false,
    message: `Client Closed Request`
} as const;

export class ClientClosedRequestError extends ClientError {
    constructor(data?: string | Error | Options, options?: Options) {
        options = mergeOptions(
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
