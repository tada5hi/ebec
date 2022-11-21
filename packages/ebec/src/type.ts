/*
 * Copyright (c) 2022.
 * Author Peter Placzek (tada5hi)
 * For the full copyright and license information,
 * view the LICENSE file that was distributed with this source code.
 */

export type Options = {
    /**
     * The error code is either a short uppercase string identifier
     * for the error or a numeric error code. For example: SERVER_ERROR
     */
    code?: string | number | null,

    /**
     * The actual error message, if not provided on another way.
     */
    message?: string,

    /**
     * Mark this error as error which need to be logged.
     */
    logMessage?: boolean,

    /**
     * Set the log level for this error.
     */
    logLevel?: string | number,

    /**
     * Specify if the error message should be decorated for public view
     * or already provide a decoration message.
     */
    decorateMessage?: boolean | string,

    /**
     * Specify a previous error.
     */
    previous?: Error,

    /**
     * In case of a http error provide a numeric Status Code between 400-599.
     */
    statusCode?: number,

    /**
     * Specify a redirect URL in case of a http error.
     */
    redirectURL?: string,

    /**
     * Additional options.
     */
    [key: string]: any
};
