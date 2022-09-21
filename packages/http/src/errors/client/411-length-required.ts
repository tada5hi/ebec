import {
    buildOptions,
    buildMessage,
    Options,
    setUnsetOptions
} from 'ebec';
import { ClientError } from '../base';

export const LengthRequiredErrorOptions : Options = {
    code: `LENGTH_REQUIRED`,
    statusCode: 411,
    decorateMessage: false,
    logMessage: false
}

export class LengthRequiredError extends ClientError {
    constructor(data?: string | Error | Options, options?: Options) {
        options = setUnsetOptions(
            buildOptions(data, options),
            LengthRequiredErrorOptions
        );

        let message = buildMessage(data, options);
        if (!message) {
            message = `Length Required`;
        }

        super(message, options);
    }
}
