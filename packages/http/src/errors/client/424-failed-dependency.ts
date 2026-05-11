import { markInstanceof } from '@ebec/core';
import { ClientError } from '../base';
import type { HTTPErrorInput, HTTPErrorOptions } from '../../types';

export const FAILED_DEPENDENCY_ERROR_INSTANCE = Symbol.for('@ebec/http/FailedDependencyError');

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
        markInstanceof(this, FAILED_DEPENDENCY_ERROR_INSTANCE);
    }
}
