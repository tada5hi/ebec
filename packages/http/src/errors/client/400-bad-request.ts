import {
    buildOptions,
    buildMessage,
    Options,
    mergeOptions
} from 'ebec';
import { ClientError } from '../base';

export const BadRequestErrorOptions : Options = {
    code: `BAD_REQUEST`,
    statusCode: 400,
    decorateMessage: false,
    logMessage: false
}

export class BadRequestError extends ClientError {
    constructor(data?: string | Error | Options, options?: Options) {
        options = mergeOptions(
            buildOptions(data, options),
            BadRequestErrorOptions
        );

        let message = buildMessage(data, options);
        if (!message) {
            message = `Bad Request`;
        }

        super(message, options);
    }
}
