import { markInstanceof } from '@ebec/core';
import { ClientError } from '../base';
import type { HTTPErrorInput, HTTPErrorOptions } from '../../types';

export const IM_A_TEAPOT_ERROR_INSTANCE = Symbol.for('@ebec/http/ImATeapotError');

export const ImATeapotErrorOptions = {
    code: 'IM_A_TEAPOT',
    status: 418,
} as const;

export class ImATeapotError extends ClientError {
    constructor(input: HTTPErrorInput = {}) {
        const options: HTTPErrorOptions = typeof input === 'string' ? { message: input } : input;
        super({
            ...options,
            code: options.code ?? ImATeapotErrorOptions.code,
            status: options.status ?? options.statusCode ?? ImATeapotErrorOptions.status,
        });
        markInstanceof(this, IM_A_TEAPOT_ERROR_INSTANCE);
    }
}
