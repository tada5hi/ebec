import type { HTTPErrorInput } from '../../types';
import { HTTPError, isHTTPError } from './http';
import type { IServerError } from './types';

export class ServerError extends HTTPError implements IServerError {
    constructor(input: HTTPErrorInput = {}) {
        super(input);
    }
}

export function isServerError(input: unknown): input is IServerError {
    if (!isHTTPError(input)) {
        return false;
    }

    const status = input.status ?? input.statusCode;
    return status >= 500 &&
        status < 600;
}
