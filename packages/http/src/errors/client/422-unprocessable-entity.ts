import {
    buildOptions,
    buildMessage,
    Options,
    mergeOptions
} from 'ebec';
import { ClientError } from '../base';
import { HTTPOptions } from '../../type';

export const UnprocessableEntityErrorOptions : HTTPOptions = {
    code: `UNPROCESSABLE_ENTITY`,
    statusCode: 422,
    decorateMessage: false,
    logMessage: false
}

export class UnprocessableEntityError extends ClientError {
    constructor(data?: string | Error | Options, options?: Options) {
        options = mergeOptions(
            buildOptions(data, options),
            UnprocessableEntityErrorOptions
        );

        let message = buildMessage(data, options);
        if (!message) {
            message = `Unprocessable Entity`;
        }

        super(message, options);
    }
}
