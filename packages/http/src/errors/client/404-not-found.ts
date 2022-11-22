import {
    buildOptions,
    buildMessage,
    Options,
    mergeOptions
} from 'ebec';
import { ClientError } from '../base';

export const NotFoundErrorOptions = {
    code: `NOT_FOUND`,
    statusCode: 404,
    decorateMessage: false,
    logMessage: false
} as const;

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
