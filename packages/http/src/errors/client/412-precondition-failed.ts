import {
    buildOptions,
    buildMessage,
    Options,
    setUnsetOptions
} from 'ebec';
import { ClientError } from '../base';

export const PreconditionFailedErrorOptions : Options = {
    code: `PRECONDITION_FAILED`,
    statusCode: 412,
    decorateMessage: false,
    logMessage: false
}

export class PreconditionFailedError extends ClientError {
    constructor(data?: string | Error | Options, options?: Options) {
        options = setUnsetOptions(
            buildOptions(data, options),
            PreconditionFailedErrorOptions
        );

        let message = buildMessage(data, options);
        if (!message) {
            message = `Precondition Failed`;
        }

        super(message, options);
    }
}
