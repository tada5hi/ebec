import {
    buildOptions,
    buildMessage,
    Options,
    mergeOptions
} from 'ebec';
import { ServerError } from '../base';
import { HTTPOptions } from '../../type';

export const InsufficientStorageErrorOptions : HTTPOptions = {
    code: `INSUFFICIENT_STORAGE`,
    statusCode: 507,
    decorateMessage: true,
    logMessage: true
}

export class InsufficientStorageError extends ServerError {
    constructor(data?: string | Error | Options, options?: Options) {
        options = mergeOptions(
            buildOptions(data, options),
            InsufficientStorageErrorOptions
        );

        let message = buildMessage(data, options);
        if (!message) {
            message = `Insufficient Storage`;
        }

        super(message, options);
    }
}
