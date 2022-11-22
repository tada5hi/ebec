/*
 * Copyright (c) 2022-2022.
 * Author Peter Placzek (tada5hi)
 * For the full copyright and license information,
 * view the LICENSE file that was distributed with this source code.
 */

import { Options } from '../type';

export function buildMessage(
    data?: string | Error | Options,
    options?: Options,
) : string | undefined {
    if (typeof data === 'undefined') {
        data = {};
    }

    if (typeof options === 'undefined') {
        options = {};
    }

    let message : string | undefined;

    if (typeof data === 'string') {
        message = data;
    }

    if (
        !message &&
        options.message
    ) {
        message = options.message;
    }

    if (
        !message &&
        !options.decorateMessage
    ) {
        if (data instanceof Error) {
            /* istanbul ignore next */
            message = data.message;
        } else if (options.previous instanceof Error) {
            message = options.previous.message;
        }
    }

    return message;
}
