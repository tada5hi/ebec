import {
    buildOptions,
    buildMessage,
    Options,
    mergeOptions
} from 'ebec';
import { ServerError } from '../base';

export const NotImplementedErrorOptions = {
    code: `NOT_IMPLEMENTED`,
    statusCode: 501,
    decorateMessage: true,
    logMessage: true
} as const;

export class NotImplementedError extends ServerError {
    constructor(data?: string | Error | Options, options?: Options) {
        options = mergeOptions(
            buildOptions(data, options),
            NotImplementedErrorOptions
        );

        let message = buildMessage(data, options);
        if (!message) {
            message = `Not Implemented`;
        }

        super(message, options);
    }
}
