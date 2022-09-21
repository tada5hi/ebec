import {
    buildOptions,
    buildMessage,
    Options,
    setUnsetOptions
} from 'ebec';
import { ClientError } from '../base';

export const NotAcceptableErrorOptions : Options = {
    code: `NOT_ACCEPTABLE`,
    statusCode: 406,
    decorateMessage: false,
    logMessage: false
}

export class NotAcceptableError extends ClientError {
    constructor(data?: string | Error | Options, options?: Options) {
        options = setUnsetOptions(
            buildOptions(data, options),
            NotAcceptableErrorOptions
        );

        let message = buildMessage(data, options);
        if (!message) {
            message = `Not Acceptable`;
        }

        super(message, options);
    }
}
