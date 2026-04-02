import { ClientError } from '../base';
import type { ErrorInput, ErrorOptions } from '../../types';

export const FailedDependencyErrorOptions = {
    code: 'FAILED_DEPENDENCY',
    statusCode: 424,
    statusMessage: 'Failed Dependency',
} as const;

export class FailedDependencyError extends ClientError {
    constructor(input: ErrorInput = {}) {
        const options: ErrorOptions = typeof input === 'string' ? { message: input } : input;
        super({
            ...options,
            code: options.code ?? FailedDependencyErrorOptions.code,
            statusCode: options.statusCode ?? FailedDependencyErrorOptions.statusCode,
            statusMessage: options.statusMessage ?? FailedDependencyErrorOptions.statusMessage,
        });
    }
}
