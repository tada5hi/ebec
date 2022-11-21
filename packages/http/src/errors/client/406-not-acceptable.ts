import {
    buildOptions,
    buildMessage,
    Options,
    mergeOptions
} from 'ebec';
import { ClientError } from '../base';
import { HTTPOptions } from '../../type';

export const NotAcceptableErrorOptions : HTTPOptions = {
    code: `NOT_ACCEPTABLE`,
    statusCode: 406,
    decorateMessage: false,
    logMessage: false
}

export class NotAcceptableError extends ClientError {
    constructor(data?: string | Error | Options, options?: Options) {
        options = mergeOptions(
            buildOptions(data, options),
            NotAcceptableErrorOptions
        );

        let message = buildMessage(data, options);
        if (!message) {
            message = `Not Acceptable`;
        }

        super(message, options);
    }
}
