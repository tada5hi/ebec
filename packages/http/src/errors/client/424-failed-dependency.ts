import { ClientError } from '../base';
import type { HTTPErrorInput, HTTPErrorOptions } from '../../types';

export const FailedDependencyErrorOptions = {
    code: 'FAILED_DEPENDENCY',
    status: 424,
} as const;

export class FailedDependencyError extends ClientError {
    constructor(input: HTTPErrorInput = {}) {
        const options: HTTPErrorOptions = typeof input === 'string' ? { message: input } : input;
        super({
            ...options,
            code: options.code ?? FailedDependencyErrorOptions.code,
            status: options.status ?? options.statusCode ?? FailedDependencyErrorOptions.status,
        });
    }
}
