import {
    buildOptions,
    buildMessage,
    Options,
    mergeOptions
} from 'ebec';
import { ClientError } from '../base';

export const PreconditionRequiredErrorOptions = {
    code: `PRECONDITION_REQUIRED`,
    statusCode: 428,
    decorateMessage: false,
    logMessage: false
} as const;

export class PreconditionRequiredError extends ClientError {
    constructor(data?: string | Error | Options, options?: Options) {
        options = mergeOptions(
            buildOptions(data, options),
            PreconditionRequiredErrorOptions
        );

        let message = buildMessage(data, options);
        if (!message) {
            message = `Precondition Required`;
        }

        super(message, options);
    }
}
