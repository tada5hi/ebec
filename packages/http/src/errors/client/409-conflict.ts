import {
    buildOptions,
    buildMessage,
    Options,
    setUnsetOptions
} from 'ebec';
import { ClientError } from '../base';

export const ConflictErrorOptions : Options = {
    code: `CONFLICT`,
    statusCode: 409,
    decorateMessage: false,
    logMessage: false
}

export class ConflictError extends ClientError {
    constructor(data?: string | Error | Options, options?: Options) {
        options = setUnsetOptions(
            buildOptions(data, options),
            ConflictErrorOptions
        );

        let message = buildMessage(data, options);
        if (!message) {
            message = `Conflict`;
        }

        super(message, options);
    }
}
