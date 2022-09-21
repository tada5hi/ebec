import {
    buildOptions,
    buildMessage,
    Options,
    mergeOptions
} from 'ebec';
import { ClientError } from '../base';

export const RequestedRangeNotSatisfiableErrorOptions : Options = {
    code: `REQUESTED_RANGE_NOT_SATISFIABLE`,
    statusCode: 416,
    decorateMessage: false,
    logMessage: false
}

export class RequestedRangeNotSatisfiableError extends ClientError {
    constructor(data?: string | Error | Options, options?: Options) {
        options = mergeOptions(
            buildOptions(data, options),
            RequestedRangeNotSatisfiableErrorOptions
        );

        let message = buildMessage(data, options);
        if (!message) {
            message = `Requested Range Not Satisfiable`;
        }

        super(message, options);
    }
}
