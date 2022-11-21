import {
    buildOptions,
    buildMessage,
    Options,
    mergeOptions
} from 'ebec';
import { ClientError } from '../base';
import { HTTPOptions } from '../../type';

export const ExpectationFailedErrorOptions : HTTPOptions = {
    code: `EXPECTATION_FAILED`,
    statusCode: 417,
    decorateMessage: false,
    logMessage: false
}

export class ExpectationFailedError extends ClientError {
    constructor(data?: string | Error | Options, options?: Options) {
        options = mergeOptions(
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
