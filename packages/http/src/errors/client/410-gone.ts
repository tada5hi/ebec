import {
    buildOptions,
    buildMessage,
    Options,
    mergeOptions
} from 'ebec';
import { ClientError } from '../base';
import { HTTPOptions } from '../../type';

export const GoneErrorOptions : HTTPOptions = {
    code: `GONE`,
    statusCode: 410,
    decorateMessage: false,
    logMessage: false
}

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
