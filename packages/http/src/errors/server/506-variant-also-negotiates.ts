import {
    buildOptions,
    buildMessage,
    Options,
    mergeOptions
} from 'ebec';
import { ServerError } from '../base';

export const VariantAlsoNegotiatesErrorOptions = {
    code: `VARIANT_ALSO_NEGOTIATES`,
    statusCode: 506,
    decorateMessage: true,
    logMessage: true,
    message: `Variant Also Negotiates`
} as const;

export class VariantAlsoNegotiatesError extends ServerError {
    constructor(data?: string | Error | Options, options?: Options) {
        options = mergeOptions(
            buildOptions(data, options),
            VariantAlsoNegotiatesErrorOptions
        );

        let message = buildMessage(data, options);
        if (!message) {
            message = `Variant Also Negotiates`;
        }

        super(message, options);
    }
}
