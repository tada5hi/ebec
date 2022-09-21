import {
    buildOptions,
    buildMessage,
    Options,
    setUnsetOptions
} from 'ebec';
import { ClientError } from '../base';

export const NoResponseErrorOptions : Options = {
    code: `NO_RESPONSE`,
    statusCode: 444,
    decorateMessage: false,
    logMessage: false
}

export class NoResponseError extends ClientError {
    constructor(data?: string | Error | Options, options?: Options) {
        options = setUnsetOptions(
            buildOptions(data, options),
            NoResponseErrorOptions
        );

        let message = buildMessage(data, options);
        if (!message) {
            message = `No Response`;
        }

        super(message, options);
    }
}
