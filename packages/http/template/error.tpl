import { {{baseClass}} } from '../base';
import type { ErrorInput, ErrorOptions } from '../../types';

export const {{{class}}}Options = {
    code: '{{code}}',
    statusCode: {{statusCode}},
    statusMessage: '{{{statusMessage}}}',
} as const;

export class {{{class}}} extends {{baseClass}} {
    constructor(input: ErrorInput = {}) {
        const options: ErrorOptions = typeof input === 'string' ? { message: input } : input;
        super({
            ...options,
            code: options.code ?? {{{class}}}Options.code,
            statusCode: options.statusCode ?? {{{class}}}Options.statusCode,
            statusMessage: options.statusMessage ?? {{{class}}}Options.statusMessage,
        });
    }
}
