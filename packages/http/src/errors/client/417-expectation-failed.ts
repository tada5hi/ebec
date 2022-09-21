import {
    buildOptions,
    buildMessage,
    Options,
    setUnsetOptions
} from 'ebec';
import { ClientError } from '../base';

export const ExpectationFailedErrorOptions : Options = {
    code: `EXPECTATION_FAILED`,
    statusCode: 417,
    decorateMessage: false,
    logMessage: false
}

export class ExpectationFailedError extends ClientError {
    constructor(data?: string | Error | Options, options?: Options) {
        options = setUnsetOptions(
            buildOptions(data, options),
            ExpectationFailedErrorOptions
        );

        let message = buildMessage(data, options);
        if (!message) {
            message = `Expectation Failed`;
        }

        super(message, options);
    }
}
