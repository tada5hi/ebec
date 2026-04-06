import type { HTTPErrorInput } from '../../types';
import { HTTPError, isHTTPError } from './http';
import type { IClientError } from './types';

export class ClientError extends HTTPError implements IClientError {
    constructor(input: HTTPErrorInput = {}) {
        super(input);
    }
}

export function isClientError(input: unknown): input is IClientError {
    if (!isHTTPError(input)) {
        return false;
    }

    return input.statusCode >= 400 &&
        input.statusCode < 500;
}
