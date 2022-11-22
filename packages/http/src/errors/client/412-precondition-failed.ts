import {
    buildOptions,
    buildMessage,
    Options,
    mergeOptions
} from 'ebec';
import { ClientError } from '../base';

export const PreconditionFailedErrorOptions = {
    code: `PRECONDITION_FAILED`,
    statusCode: 412,
    decorateMessage: false,
    logMessage: false,
    message: `Precondition Failed`
} as const;

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
