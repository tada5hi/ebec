import { markInstanceof, matchesInstanceof } from '@ebec/core';
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
    if (matchesInstanceof(input, CLIENT_ERROR_INSTANCE)) {
        return true;
    }

    // Identity wins first (the marker match above): a ClientError instance
    // matches regardless of status. Otherwise chain authority is delegated
    // to isHTTPError — chain-only itself, so it rejects anything that isn't
    // a confirmed HTTPError — and status range decides from there, so a bare
    // `new HTTPError({ status: 404 })`, which never marks itself as a
    // ClientError, still counts as a client error.
    if (!isHTTPError(input)) {
        return false;
    }

    const status = input.status ?? input.statusCode;
    return status >= 400 &&
        status < 500;
}
