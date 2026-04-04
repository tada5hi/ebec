import type { ErrorOptions as BaseErrorOptions } from '@ebec/core';

export type HTTPErrorOptions = BaseErrorOptions & {
    /**
     * A numeric Status Code between 400-599.
     */
    statusCode?: number | string,

    /**
     * A status message.
     */
    statusMessage?: string,

    /**
     * Specify a redirect URL in case of a http error.
     */
    redirectURL?: string
};

export type HTTPErrorInput = string | HTTPErrorOptions;
