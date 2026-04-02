import type { Input } from '../../types';
import { HTTPError, isHTTPError } from './http';

export class ServerError extends HTTPError {
    constructor(...input: Input[]) {
        super({ expose: false }, ...input);
    }
}

export function isServerError(error: unknown): error is ServerError {
    if (!isHTTPError(error)) {
        return false;
    }

    return error.statusCode >= 500 &&
        error.statusCode < 600;
}
