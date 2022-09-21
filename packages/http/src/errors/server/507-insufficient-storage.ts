import {
    buildOptions,
    buildMessage,
    Options,
    setUnsetOptions
} from 'ebec';
import { ServerError } from '../base';

export const InsufficientStorageErrorOptions : Options = {
    code: `INSUFFICIENT_STORAGE`,
    statusCode: 507,
    decorateMessage: true,
    logMessage: true
}

export class InsufficientStorageError extends ServerError {
    constructor(data?: string | Error | Options, options?: Options) {
        options = setUnsetOptions(
            buildOptions(data, options),
            InsufficientStorageErrorOptions
        );

        let message = buildMessage(data, options);
        if (!message) {
            message = `Insufficient Storage`;
        }

        super(message, options);
    }
}
