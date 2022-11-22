import {
    buildOptions,
    buildMessage,
    Options,
    mergeOptions
} from 'ebec';
import { ClientError } from '../base';

export const ImATeapotErrorOptions = {
    code: `IM_A_TEAPOT`,
    statusCode: 418,
    decorateMessage: false,
    logMessage: false,
    message: `I&#39;m a Teapot`
} as const;

export class ImATeapotError extends ClientError {
    constructor(data?: string | Error | Options, options?: Options) {
        options = mergeOptions(
            buildOptions(data, options),
            ImATeapotErrorOptions
        );

        let message = buildMessage(data, options);
        if (!message) {
            message = `I'm a Teapot`;
        }

        super(message, options);
    }
}
