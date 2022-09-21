/*
 * Copyright (c) 2021-2022.
 * Author Peter Placzek (tada5hi)
 * For the full copyright and license information,
 * view the LICENSE file that was distributed with this source code.
 */

import { merge } from 'smob';
import { Options } from '../type';

/**
 * Deep merge two objects.
 * @param target
 * @param sources
 */
export function mergeOptions(
    target: Options,
    ...sources: Options[]
) : Options {
    return merge(target, ...sources);
}

export function buildOptions(
    data?: string | Error | Options,
    options?: Options,
) : Options {
    if (typeof data === 'undefined') {
        data = {};
    }

    if (typeof options === 'undefined') {
        options = {};
    }

    if (
        !(data instanceof Error) &&
        typeof data !== 'string'
    ) {
        options = mergeOptions({}, data, { ...options });
    }

    if (
        !options.previous &&
        data instanceof Error
    ) {
        options.previous = data;
    }

    return options;
}
