import {
    buildOptions,
    buildMessage,
    Options,
    mergeOptions
} from 'ebec';
import { ClientError } from '../base';

export const NoResponseErrorOptions = {
    code: `NO_RESPONSE`,
    statusCode: 444,
    decorateMessage: false,
    logMessage: false
} as const;

export class NoResponseError extends ClientError {
    constructor(data?: string | Error | Options, options?: Options) {
        options = mergeOptions(
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
