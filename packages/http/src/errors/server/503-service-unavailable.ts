import {
    buildOptions,
    buildMessage,
    Options,
    mergeOptions
} from 'ebec';
import { ServerError } from '../base';

export const ServiceUnavailableErrorOptions : Options = {
    code: `SERVICE_UNAVAILABLE`,
    statusCode: 503,
    decorateMessage: true,
    logMessage: true
}

export class ServiceUnavailableError extends ServerError {
    constructor(data?: string | Error | Options, options?: Options) {
        options = mergeOptions(
            buildOptions(data, options),
            ServiceUnavailableErrorOptions
        );

        let message = buildMessage(data, options);
        if (!message) {
            message = `Service Unavailable`;
        }

        super(message, options);
    }
}
