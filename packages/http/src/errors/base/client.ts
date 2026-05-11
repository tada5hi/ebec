import { hasInstanceof, markInstanceof } from '@ebec/core';
import type { HTTPErrorInput } from '../../types';
import { HTTPError, isHTTPError } from './http';
import type { IClientError } from './types';

export const CLIENT_ERROR_INSTANCE = Symbol.for('@ebec/http/ClientError');

export class ClientError extends HTTPError implements IClientError {
    constructor(input: HTTPErrorInput = {}) {
        super(input);
        markInstanceof(this, CLIENT_ERROR_INSTANCE);
    }
}

export function isClientError(input: unknown): input is IClientError {
    if (hasInstanceof(input, CLIENT_ERROR_INSTANCE)) {
        return true;
    }

    if (!isHTTPError(input)) {
        return false;
    }

    const status = input.status ?? input.statusCode;
    return status >= 400 &&
        status < 500;
}
