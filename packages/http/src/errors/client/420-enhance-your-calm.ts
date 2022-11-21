import {
    buildOptions,
    buildMessage,
    Options,
    mergeOptions
} from 'ebec';
import { ClientError } from '../base';
import { HTTPOptions } from '../../type';

export const EnhanceYourCalmErrorOptions : HTTPOptions = {
    code: `ENHANCE_YOUR_CALM`,
    statusCode: 420,
    decorateMessage: false,
    logMessage: false
}

export class EnhanceYourCalmError extends ClientError {
    constructor(data?: string | Error | Options, options?: Options) {
        options = mergeOptions(
            buildOptions(data, options),
            EnhanceYourCalmErrorOptions
        );

        let message = buildMessage(data, options);
        if (!message) {
            message = `Enhance Your Calm`;
        }

        super(message, options);
    }
}
