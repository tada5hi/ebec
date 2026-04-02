import type { Input } from '../../types';
import { HTTPError, isHTTPError } from './http';

export class ClientError extends HTTPError {
    constructor(...input: Input[]) {
        super({ expose: true }, ...input);
    }
}

export function isClientError(input: unknown): input is ClientError {
    if (!isHTTPError(input)) {
        return false;
    }

    return input.statusCode >= 400 &&
        input.statusCode < 500;
}
