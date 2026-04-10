import { ClientError } from '../base';
import type { HTTPErrorInput, HTTPErrorOptions } from '../../types';

export const PreconditionRequiredErrorOptions = {
    code: 'PRECONDITION_REQUIRED',
    status: 428,
} as const;

export class PreconditionRequiredError extends ClientError {
    constructor(input: HTTPErrorInput = {}) {
        const options: HTTPErrorOptions = typeof input === 'string' ? { message: input } : input;
        super({
            ...options,
            code: options.code ?? PreconditionRequiredErrorOptions.code,
            status: options.status ?? options.statusCode ?? PreconditionRequiredErrorOptions.status,
        });
    }
}
