import { markInstanceof } from '@ebec/core';
import { ClientError } from '../base';
import type { HTTPErrorInput, HTTPErrorOptions } from '../../types';

export const UPGRADE_REQUIRED_ERROR_INSTANCE = Symbol.for('@ebec/http/UpgradeRequiredError');

export const UpgradeRequiredErrorOptions = {
    code: 'UPGRADE_REQUIRED',
    status: 426,
} as const;

export class UpgradeRequiredError extends ClientError {
    constructor(input: HTTPErrorInput = {}) {
        const options: HTTPErrorOptions = typeof input === 'string' ? { message: input } : input;
        super({
            ...options,
            code: options.code ?? UpgradeRequiredErrorOptions.code,
            status: options.status ?? options.statusCode ?? UpgradeRequiredErrorOptions.status,
        });
        markInstanceof(this, UPGRADE_REQUIRED_ERROR_INSTANCE);
    }
}
