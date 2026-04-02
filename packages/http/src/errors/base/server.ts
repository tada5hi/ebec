import type { ErrorInput } from '../../types';
import { HTTPError, isHTTPError } from './http';
import type { IServerError } from './types';

export class ServerError extends HTTPError {
    constructor(input: ErrorInput = {}) {
        super(input);
    }
}

export function isServerError(input: unknown): input is IServerError {
    if (!isHTTPError(input)) {
        return false;
    }

    return input.statusCode >= 500 &&
        input.statusCode < 600;
}
