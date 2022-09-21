import {
    buildOptions,
    buildMessage,
    Options,
    setUnsetOptions
} from 'ebec';
import { ClientError } from '../base';

export const UnprocessableEntityErrorOptions : Options = {
    code: `UNPROCESSABLE_ENTITY`,
    statusCode: 422,
    decorateMessage: false,
    logMessage: false
}

export class UnprocessableEntityError extends ClientError {
    constructor(data?: string | Error | Options, options?: Options) {
        options = setUnsetOptions(
            buildOptions(data, options),
            UnprocessableEntityErrorOptions
        );

        let message = buildMessage(data, options);
        if (!message) {
            message = `Unprocessable Entity`;
        }

        super(message, options);
    }
}
