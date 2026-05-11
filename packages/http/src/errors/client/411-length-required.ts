import { markInstanceof } from '@ebec/core';
import { ClientError } from '../base';
import type { HTTPErrorInput, HTTPErrorOptions } from '../../types';

export const LENGTH_REQUIRED_ERROR_INSTANCE = Symbol.for('@ebec/http/LengthRequiredError');

export const LengthRequiredErrorOptions = {
    code: 'LENGTH_REQUIRED',
    status: 411,
} as const;

export class LengthRequiredError extends ClientError {
    constructor(input: HTTPErrorInput = {}) {
        const options: HTTPErrorOptions = typeof input === 'string' ? { message: input } : input;
        super({
            ...options,
            code: options.code ?? LengthRequiredErrorOptions.code,
            status: options.status ?? options.statusCode ?? LengthRequiredErrorOptions.status,
        });
        markInstanceof(this, LENGTH_REQUIRED_ERROR_INSTANCE);
    }
}
