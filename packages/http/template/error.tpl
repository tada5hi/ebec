import {
    buildOptions,
    buildMessage,
    Options,
    setUnsetOptions
} from 'ebec';
import { {{baseClass}} } from '../base';

export const {{{class}}}Options : Options = {
    code: `{{code}}`,
    statusCode: {{statusCode}},
    decorateMessage: {{{decorateMessage}}},
    logMessage: {{{logMessage}}}
}

export class {{{class}}} extends {{baseClass}} {
    constructor(data?: string | Error | Options, options?: Options) {
        options = setUnsetOptions(
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
