import {
    buildOptions,
    buildMessage,
    Options,
    mergeOptions
} from 'ebec';
import { ServerError } from '../base';

export const NotExtendedErrorOptions = {
    code: `NOT_EXTENDED`,
    statusCode: 510,
    decorateMessage: true,
    logMessage: true,
    message: `Not Extended`
} as const;

export class NotExtendedError extends ServerError {
    constructor(data?: string | Error | Options, options?: Options) {
        options = mergeOptions(
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
