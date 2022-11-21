import {
    buildOptions,
    buildMessage,
    Options,
    mergeOptions
} from 'ebec';
import { ClientError } from '../base';
import { HTTPOptions } from '../../type';

export const LengthRequiredErrorOptions : HTTPOptions = {
    code: `LENGTH_REQUIRED`,
    statusCode: 411,
    decorateMessage: false,
    logMessage: false
}

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
