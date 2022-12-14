import {
    buildOptions,
    buildMessage,
    Options,
    mergeOptions
} from 'ebec';
import { ClientError } from '../base';

export const LockedErrorOptions = {
    code: `LOCKED`,
    statusCode: 423,
    decorateMessage: false,
    logMessage: false,
    message: `Locked`
} as const;

export class LockedError extends ClientError {
    constructor(data?: string | Error | Options, options?: Options) {
        options = mergeOptions(
            buildOptions(data, options),
            LockedErrorOptions
        );

        let message = buildMessage(data, options);
        if (!message) {
            message = `Locked`;
        }

        super(message, options);
    }
}
