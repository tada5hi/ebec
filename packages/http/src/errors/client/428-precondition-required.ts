import {
    buildOptions,
    buildMessage,
    Options,
    setUnsetOptions
} from 'ebec';
import { ClientError } from '../base';

export const PreconditionRequiredErrorOptions : Options = {
    code: `PRECONDITION_REQUIRED`,
    statusCode: 428,
    decorateMessage: false,
    logMessage: false
}

export class PreconditionRequiredError extends ClientError {
    constructor(data?: string | Error | Options, options?: Options) {
        options = setUnsetOptions(
            buildOptions(data, options),
            PreconditionRequiredErrorOptions
        );

        let message = buildMessage(data, options);
        if (!message) {
            message = `Precondition Required`;
        }

        super(message, options);
    }
}
