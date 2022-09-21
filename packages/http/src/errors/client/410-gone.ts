import {
    buildOptions,
    buildMessage,
    Options,
    setUnsetOptions
} from 'ebec';
import { ClientError } from '../base';

export const GoneErrorOptions : Options = {
    code: `GONE`,
    statusCode: 410,
    decorateMessage: false,
    logMessage: false
}

export class GoneError extends ClientError {
    constructor(data?: string | Error | Options, options?: Options) {
        options = setUnsetOptions(
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
