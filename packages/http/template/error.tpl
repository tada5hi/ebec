import { markInstanceof } from '@ebec/core';
import { {{baseClass}} } from '../base';
import type { HTTPErrorInput, HTTPErrorOptions } from '../../types';

export const {{instanceConstantName}} = Symbol.for('@ebec/http/{{{class}}}');

export const {{{class}}}Options = {
    code: '{{code}}',
    status: {{statusCode}},
} as const;

export class {{{class}}} extends {{baseClass}} {
    constructor(input: HTTPErrorInput = {}) {
        const options: HTTPErrorOptions = typeof input === 'string' ? { message: input } : input;
        super({
            ...options,
            code: options.code ?? {{{class}}}Options.code,
            status: options.status ?? options.statusCode ?? {{{class}}}Options.status,
        });
        markInstanceof(this, {{instanceConstantName}});
    }
}
