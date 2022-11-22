import {
    buildOptions,
    buildMessage,
    Options,
    mergeOptions
} from 'ebec';
import { ClientError } from '../base';

export const UnsupportedMediaTypeErrorOptions = {
    code: `UNSUPPORTED_MEDIA_TYPE`,
    statusCode: 415,
    decorateMessage: false,
    logMessage: false
} as const;

export class UnsupportedMediaTypeError extends ClientError {
    constructor(data?: string | Error | Options, options?: Options) {
        options = mergeOptions(
            buildOptions(data, options),
            UnsupportedMediaTypeErrorOptions
        );

        let message = buildMessage(data, options);
        if (!message) {
            message = `Unsupported Media Type`;
        }

        super(message, options);
    }
}
