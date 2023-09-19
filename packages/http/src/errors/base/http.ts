/*
 * Copyright (c) 2023-2023.
 * Author Peter Placzek (tada5hi)
 * For the full copyright and license information,
 * view the LICENSE file that was distributed with this source code.
 */

import { BaseError, isOptions as isBaseOptions } from 'ebec';
import type { Input } from '../../types';
import { extractOptions, isOptions } from '../../utils';

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

        this.statusCode = options.statusCode || 500;
        this.statusMessage = options.statusMessage;
        this.redirectURL = options.redirectURL;
    }
}

export function isHTTPError(error: unknown): error is HTTPError {
    if (error instanceof HTTPError) {
        return true;
    }

    if (!isOptions(error) || !isBaseOptions(error)) {
        return false;
    }

    return typeof error.statusCode === 'number';
}
