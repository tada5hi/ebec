import {
    buildOptions,
    buildMessage,
    Options,
    setUnsetOptions
} from 'ebec';
import { ServerError } from '../base';

export const LoopDetectedErrorOptions : Options = {
    code: `LOOP_DETECTED`,
    statusCode: 508,
    decorateMessage: true,
    logMessage: true
}

export class LoopDetectedError extends ServerError {
    constructor(data?: string | Error | Options, options?: Options) {
        options = setUnsetOptions(
            buildOptions(data, options),
            LoopDetectedErrorOptions
        );

        let message = buildMessage(data, options);
        if (!message) {
            message = `Loop Detected`;
        }

        super(message, options);
    }
}
