import {
    buildOptions,
    buildMessage,
    Options,
    setUnsetOptions
} from 'ebec';
import { ServerError } from '../base';

export const NotImplementedErrorOptions : Options = {
    code: `NOT_IMPLEMENTED`,
    statusCode: 501,
    decorateMessage: true,
    logMessage: true
}

export class NotImplementedError extends ServerError {
    constructor(data?: string | Error | Options, options?: Options) {
        options = setUnsetOptions(
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
