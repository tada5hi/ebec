import {
    buildOptions,
    buildMessage,
    Options,
    mergeOptions
} from 'ebec';
import { ClientError } from '../base';

export const GoneErrorOptions = {
    code: `GONE`,
    statusCode: 410,
    decorateMessage: false,
    logMessage: false,
    message: `Gone`
} as const;

export class GoneError extends ClientError {
    constructor(data?: string | Error | Options, options?: Options) {
        options = mergeOptions(
            buildOptions(data, options),
            GoneErrorOptions
        );

        let message = buildMessage(data, options);
        if (!message) {
            message = `Gone`;
        }

        super(message, options);
    }
}
