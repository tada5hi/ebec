import {
    buildOptions,
    buildMessage,
    Options,
    mergeOptions
} from 'ebec';
import { ClientError } from '../base';

export const FailedDependencyErrorOptions = {
    code: `FAILED_DEPENDENCY`,
    statusCode: 424,
    decorateMessage: false,
    logMessage: false
} as const;

export class FailedDependencyError extends ClientError {
    constructor(data?: string | Error | Options, options?: Options) {
        options = mergeOptions(
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
