import {
    buildOptions,
    buildMessage,
    Options,
    mergeOptions
} from 'ebec';
import { ClientError } from '../base';
import { HTTPOptions } from '../../type';

export const MethodNotAllowedErrorOptions : HTTPOptions = {
    code: `METHOD_NOT_ALLOWED`,
    statusCode: 405,
    decorateMessage: false,
    logMessage: false
}

export class MethodNotAllowedError extends ClientError {
    constructor(data?: string | Error | Options, options?: Options) {
        options = mergeOptions(
            buildOptions(data, options),
            MethodNotAllowedErrorOptions
        );

        let message = buildMessage(data, options);
        if (!message) {
            message = `Method Not Allowed`;
        }

        super(message, options);
    }
}
