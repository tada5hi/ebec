import {
    buildOptions,
    buildMessage,
    Options,
    setUnsetOptions
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
        options = setUnsetOptions(
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
