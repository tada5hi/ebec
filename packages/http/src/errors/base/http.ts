import { BaseError, hasOwnProperty, isBaseError } from 'ebec';
import type { Input } from '../../types';
import {
    extractOptions,
    isErrorRedirectURL,
    isErrorStatusCode,
    isErrorStatusMessage,
    sanitizeStatusCode,
    sanitizeStatusMessage,
} from '../../utils';

export class HTTPError extends BaseError {
    /**
     * A numeric Status Code between 400-599.
     */
    statusCode: number;

    /**
     * A status message.
     */
    statusMessage?: string;

    /**
     * Specify a redirect URL in case of a http error.
     */
    redirectURL?: string;

    constructor(...input: Input[]) {
        super(...input);

        const options = extractOptions(...input);

        this.statusCode = options.statusCode ?
            sanitizeStatusCode(options.statusCode) :
            500;

        this.statusMessage = options.statusMessage ?
            sanitizeStatusMessage(options.statusMessage) :
            undefined;

        this.redirectURL = options.redirectURL;
    }
}

export function isHTTPError(error: unknown): error is HTTPError {
    if (!isBaseError(error)) {
        return false;
    }

    if (
        !hasOwnProperty(error, 'statusCode') ||
        !isErrorStatusCode(error.statusCode)
    ) {
        return false;
    }

    if (
        hasOwnProperty(error, 'statusMessage') &&
        typeof error.statusMessage !== 'undefined' &&
        !isErrorStatusMessage(error.statusMessage)
    ) {
        return false;
    }

    if (
        hasOwnProperty(error, 'redirectURL') &&
        typeof error.redirectURL !== 'undefined' &&
        !isErrorRedirectURL(error.redirectURL)
    ) {
        return false;
    }

    const statusCode = sanitizeStatusCode(error.statusCode);

    return statusCode >= 400 &&
        statusCode < 600;
}
