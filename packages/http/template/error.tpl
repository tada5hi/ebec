import { {{baseClass}} } from '../base';
import type { HTTPErrorInput, HTTPErrorOptions } from '../../types';

export const {{{class}}}Options = {
    code: '{{code}}',
    status: {{statusCode}},
    statusMessage: '{{{statusMessage}}}',
} as const;

export class {{{class}}} extends {{baseClass}} {
    constructor(input: HTTPErrorInput = {}) {
        const options: HTTPErrorOptions = typeof input === 'string' ? { message: input } : input;
        super({
            ...options,
            code: options.code ?? {{{class}}}Options.code,
            status: options.status ?? options.statusCode ?? {{{class}}}Options.status,
            statusMessage: options.statusMessage ?? {{{class}}}Options.statusMessage,
        });
    }
}
