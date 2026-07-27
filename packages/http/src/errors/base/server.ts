import { markInstanceof, matchesInstanceof } from '@ebec/core';
import type { HTTPErrorInput } from '../../types';
import { HTTPError, isHTTPError } from './http';
import type { IServerError } from './types';

export const SERVER_ERROR_INSTANCE = Symbol.for('@ebec/http/ServerError');

export class ServerError extends HTTPError implements IServerError {
    constructor(input: HTTPErrorInput = {}) {
        super(input);
        markInstanceof(this, SERVER_ERROR_INSTANCE);
    }
}

export function isServerError(input: unknown): input is IServerError {
    if (matchesInstanceof(input, SERVER_ERROR_INSTANCE)) {
        return true;
    }

    if (!isHTTPError(input)) {
        return false;
    }

    const status = input.status ?? input.statusCode;
    return status >= 500 &&
        status < 600;
}
