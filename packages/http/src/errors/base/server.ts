import { isOptions as isBaseOptions } from 'ebec';
import { isOptions, sanitizeStatusCode } from '../../utils';
import { HTTPError } from './http';

export class ServerError extends HTTPError {

}

export function isServerError(error: unknown): error is ServerError {
    if (error instanceof ServerError) {
        return true;
    }

    if (!isOptions(error) || !error.statusCode || !isBaseOptions(error)) {
        return false;
    }

    const statusCode = sanitizeStatusCode(error.statusCode);

    return statusCode >= 500 &&
        statusCode < 600;
}
