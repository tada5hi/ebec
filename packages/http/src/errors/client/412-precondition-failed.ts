import { ClientError } from '../base';
import type { HTTPErrorInput, HTTPErrorOptions } from '../../types';

export const PreconditionFailedErrorOptions = {
    code: 'PRECONDITION_FAILED',
    statusCode: 412,
    statusMessage: 'Precondition Failed',
} as const;

export class PreconditionFailedError extends ClientError {
    constructor(input: HTTPErrorInput = {}) {
        const options: HTTPErrorOptions = typeof input === 'string' ? { message: input } : input;
        super({
            ...options,
            code: options.code ?? PreconditionFailedErrorOptions.code,
            statusCode: options.statusCode ?? PreconditionFailedErrorOptions.statusCode,
            statusMessage: options.statusMessage ?? PreconditionFailedErrorOptions.statusMessage,
        });
    }
}
