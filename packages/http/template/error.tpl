import {
    buildOptions,
    buildMessage,
    Options,
    mergeOptions
} from 'ebec';
import { {{baseClass}} } from '../base';

export const {{{class}}}Options = {
    code: `{{code}}`,
    statusCode: {{statusCode}},
    decorateMessage: {{{decorateMessage}}},
    logMessage: {{{logMessage}}},
    message: `{{message}}`
} as const;

export class {{{class}}} extends {{baseClass}} {
    constructor(data?: string | Error | Options, options?: Options) {
        options = mergeOptions(
            buildOptions(data, options),
            {{{class}}}Options
        );

        let message = buildMessage(data, options);
        if (!message) {
            message = `{{{message}}}`;
        }

        super(message, options);
    }
}
