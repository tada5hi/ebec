import { ClientError } from '../base';
import type { HTTPErrorInput, HTTPErrorOptions } from '../../types';

export const ExpectationFailedErrorOptions = {
    code: 'EXPECTATION_FAILED',
    statusCode: 417,
    statusMessage: 'Expectation Failed',
} as const;

export class ExpectationFailedError extends ClientError {
    constructor(input: HTTPErrorInput = {}) {
        const options: HTTPErrorOptions = typeof input === 'string' ? { message: input } : input;
        super({
            ...options,
            code: options.code ?? ExpectationFailedErrorOptions.code,
            statusCode: options.statusCode ?? ExpectationFailedErrorOptions.statusCode,
            statusMessage: options.statusMessage ?? ExpectationFailedErrorOptions.statusMessage,
        });
    }
}
