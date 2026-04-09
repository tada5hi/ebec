import { ClientError } from '../base';
import type { HTTPErrorInput, HTTPErrorOptions } from '../../types';

export const ExpectationFailedErrorOptions = {
    code: 'EXPECTATION_FAILED',
    status: 417,
    statusMessage: 'Expectation Failed',
} as const;

export class ExpectationFailedError extends ClientError {
    constructor(input: HTTPErrorInput = {}) {
        const options: HTTPErrorOptions = typeof input === 'string' ? { message: input } : input;
        super({
            ...options,
            code: options.code ?? ExpectationFailedErrorOptions.code,
            status: options.status ?? options.statusCode ?? ExpectationFailedErrorOptions.status,
            statusMessage: options.statusMessage ?? ExpectationFailedErrorOptions.statusMessage,
        });
    }
}
