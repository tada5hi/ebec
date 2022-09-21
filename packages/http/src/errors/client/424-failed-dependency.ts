import {
    buildOptions,
    buildMessage,
    Options,
    setUnsetOptions
} from 'ebec';
import { ClientError } from '../base';

export const FailedDependencyErrorOptions : Options = {
    code: `FAILED_DEPENDENCY`,
    statusCode: 424,
    decorateMessage: false,
    logMessage: false
}

export class FailedDependencyError extends ClientError {
    constructor(data?: string | Error | Options, options?: Options) {
        options = setUnsetOptions(
            buildOptions(data, options),
            FailedDependencyErrorOptions
        );

        let message = buildMessage(data, options);
        if (!message) {
            message = `Failed Dependency`;
        }

        super(message, options);
    }
}
