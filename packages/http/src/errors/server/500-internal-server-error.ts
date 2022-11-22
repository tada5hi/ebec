import {
    buildOptions,
    buildMessage,
    Options,
    mergeOptions
} from 'ebec';
import { ServerError } from '../base';

export const InternalServerErrorOptions = {
    code: `INTERNAL_SERVER_ERROR`,
    statusCode: 500,
    decorateMessage: true,
    logMessage: true
} as const;

export class InternalServerError extends ServerError {
    constructor(data?: string | Error | Options, options?: Options) {
        options = mergeOptions(
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
