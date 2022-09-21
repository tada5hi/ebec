import {
    buildOptions,
    buildMessage,
    Options,
    mergeOptions
} from 'ebec';
import { ClientError } from '../base';

export const UnorderedCollectionErrorOptions : Options = {
    code: `UNORDERED_COLLECTION`,
    statusCode: 425,
    decorateMessage: false,
    logMessage: false
}

export class UnorderedCollectionError extends ClientError {
    constructor(data?: string | Error | Options, options?: Options) {
        options = mergeOptions(
            buildOptions(data, options),
            UnorderedCollectionErrorOptions
        );

        let message = buildMessage(data, options);
        if (!message) {
            message = `Unordered Collection`;
        }

        super(message, options);
    }
}
