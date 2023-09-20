import { isOptions as isBaseOptions } from 'ebec';
import { isOptions, sanitizeStatusCode } from '../../utils';
import { HTTPError } from './http';

export class ClientError extends HTTPError {

}

export function isClientError(error: unknown): error is ClientError {
    if (error instanceof ClientError) {
        return true;
    }

    if (!isOptions(error) || !error.statusCode || !isBaseOptions(error)) {
        return false;
    }

    const statusCode = sanitizeStatusCode(error.statusCode);

    return statusCode >= 400 &&
        statusCode < 500;
}
