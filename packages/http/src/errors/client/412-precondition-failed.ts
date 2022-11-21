import {
    buildOptions,
    buildMessage,
    Options,
    mergeOptions
} from 'ebec';
import { ClientError } from '../base';
import { HTTPOptions } from '../../type';

export const PreconditionFailedErrorOptions : HTTPOptions = {
    code: `PRECONDITION_FAILED`,
    statusCode: 412,
    decorateMessage: false,
    logMessage: false
}

export class PreconditionFailedError extends ClientError {
    constructor(data?: string | Error | Options, options?: Options) {
        options = mergeOptions(
            buildOptions(data, options),
            PreconditionFailedErrorOptions
        );

        let message = buildMessage(data, options);
        if (!message) {
            message = `Precondition Failed`;
        }

        super(message, options);
    }
}
