import {
    buildOptions,
    buildMessage,
    Options,
    mergeOptions
} from 'ebec';
import { ClientError } from '../base';

export const LengthRequiredErrorOptions = {
    code: `LENGTH_REQUIRED`,
    statusCode: 411,
    decorateMessage: false,
    logMessage: false
} as const;

export class LengthRequiredError extends ClientError {
    constructor(data?: string | Error | Options, options?: Options) {
        options = mergeOptions(
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
