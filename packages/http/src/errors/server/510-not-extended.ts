import {
    buildOptions,
    buildMessage,
    Options,
    setUnsetOptions
} from 'ebec';
import { ServerError } from '../base';

export const NotExtendedErrorOptions : Options = {
    code: `NOT_EXTENDED`,
    statusCode: 510,
    decorateMessage: true,
    logMessage: true
}

export class NotExtendedError extends ServerError {
    constructor(data?: string | Error | Options, options?: Options) {
        options = setUnsetOptions(
            buildOptions(data, options),
            NotExtendedErrorOptions
        );

        let message = buildMessage(data, options);
        if (!message) {
            message = `Not Extended`;
        }

        super(message, options);
    }
}
