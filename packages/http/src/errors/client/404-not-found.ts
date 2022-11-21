import {
    buildOptions,
    buildMessage,
    Options,
    mergeOptions
} from 'ebec';
import { ClientError } from '../base';
import { HTTPOptions } from '../../type';

export const NotFoundErrorOptions : HTTPOptions = {
    code: `NOT_FOUND`,
    statusCode: 404,
    decorateMessage: false,
    logMessage: false
}

export class NotFoundError extends ClientError {
    constructor(data?: string | Error | Options, options?: Options) {
        options = mergeOptions(
            buildOptions(data, options),
            NotFoundErrorOptions
        );

        let message = buildMessage(data, options);
        if (!message) {
            message = `Not Found`;
        }

        super(message, options);
    }
}
