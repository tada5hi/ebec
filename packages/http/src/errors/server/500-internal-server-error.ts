import {
    buildOptions,
    buildMessage,
    Options,
    setUnsetOptions
} from 'ebec';
import { ServerError } from '../base';

export const InternalServerErrorOptions : Options = {
    code: `INTERNAL_SERVER_ERROR`,
    statusCode: 500,
    decorateMessage: true,
    logMessage: true
}

export class InternalServerError extends ServerError {
    constructor(data?: string | Error | Options, options?: Options) {
        options = setUnsetOptions(
            buildOptions(data, options),
            InternalServerErrorOptions
        );

        let message = buildMessage(data, options);
        if (!message) {
            message = `Internal Server Error`;
        }

        super(message, options);
    }
}
