/*
 * Copyright (c) 2023.
 * Author Peter Placzek (tada5hi)
 * For the full copyright and license information,
 * view the LICENSE file that was distributed with this source code.
 */

import type { Options as BaseOptions } from 'ebec';

export type Options = BaseOptions & {
    /**
     * A numeric Status Code between 400-599.
     */
    statusCode?: number,

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
