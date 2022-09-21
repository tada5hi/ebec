import {
    buildOptions,
    buildMessage,
    Options,
    setUnsetOptions
} from 'ebec';
import { ClientError } from '../base';

export const ImATeapotErrorOptions : Options = {
    code: `IM_A_TEAPOT`,
    statusCode: 418,
    decorateMessage: false,
    logMessage: false
}

export class ImATeapotError extends ClientError {
    constructor(data?: string | Error | Options, options?: Options) {
        options = setUnsetOptions(
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
