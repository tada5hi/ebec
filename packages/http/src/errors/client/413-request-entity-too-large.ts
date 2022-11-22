import {
    buildOptions,
    buildMessage,
    Options,
    mergeOptions
} from 'ebec';
import { ClientError } from '../base';

export const RequestEntityTooLargeErrorOptions = {
    code: `REQUEST_ENTITY_TOO_LARGE`,
    statusCode: 413,
    decorateMessage: false,
    logMessage: false
} as const;

export class RequestEntityTooLargeError extends ClientError {
    constructor(data?: string | Error | Options, options?: Options) {
        options = mergeOptions(
            buildOptions(data, options),
            RequestEntityTooLargeErrorOptions
        );

        let message = buildMessage(data, options);
        if (!message) {
            message = `REQUEST_ENTITY_TOO_LARGE`;
        }

        super(message, options);
    }
}
