import {
    buildOptions,
    buildMessage,
    Options,
    mergeOptions
} from 'ebec';
import { ClientError } from '../base';
import { HTTPOptions } from '../../type';

export const FailedDependencyErrorOptions : HTTPOptions = {
    code: `FAILED_DEPENDENCY`,
    statusCode: 424,
    decorateMessage: false,
    logMessage: false
}

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
