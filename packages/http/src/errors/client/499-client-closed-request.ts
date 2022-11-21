import {
    buildOptions,
    buildMessage,
    Options,
    mergeOptions
} from 'ebec';
import { ClientError } from '../base';
import { HTTPOptions } from '../../type';

export const ClientClosedRequestErrorOptions : HTTPOptions = {
    code: `CLIENT_CLOSED_REQUEST`,
    statusCode: 499,
    decorateMessage: false,
    logMessage: false
}

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
