import type { Options as BaseOptions } from 'ebec';

export type Options = BaseOptions & {
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

export type Input = Options | Error | string;
