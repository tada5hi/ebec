import {
    buildOptions,
    buildMessage,
    Options,
    mergeOptions
} from 'ebec';
import { ClientError } from '../base';

export const UnauthorizedErrorOptions = {
    code: `UNAUTHORIZED`,
    statusCode: 401,
    decorateMessage: false,
    logMessage: false,
    message: `Unauthorized`
} as const;

export class UnauthorizedError extends ClientError {
    constructor(data?: string | Error | Options, options?: Options) {
        options = mergeOptions(
            buildOptions(data, options),
            UnauthorizedErrorOptions
        );

        let message = buildMessage(data, options);
        if (!message) {
            message = `Unauthorized`;
        }

        super(message, options);
    }
}
