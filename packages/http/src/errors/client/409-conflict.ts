import {
    buildOptions,
    buildMessage,
    Options,
    mergeOptions
} from 'ebec';
import { ClientError } from '../base';
import { HTTPOptions } from '../../type';

export const ConflictErrorOptions : HTTPOptions = {
    code: `CONFLICT`,
    statusCode: 409,
    decorateMessage: false,
    logMessage: false
}

export class ConflictError extends ClientError {
    constructor(data?: string | Error | Options, options?: Options) {
        options = mergeOptions(
            buildOptions(data, options),
            ConflictErrorOptions
        );

        let message = buildMessage(data, options);
        if (!message) {
            message = `Conflict`;
        }

        super(message, options);
    }
}
