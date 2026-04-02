/*
 * Copyright (c) 2026.
 *  Author Peter Placzek (tada5hi)
 *  For the full copyright and license information,
 *  view the LICENSE file that was distributed with this source code.
 */

import { isObject } from '../helpers/object';

export function isError(input: unknown) : input is Error & Record<string, unknown> {
    if (!isObject(input)) {
        return false;
    }

    return typeof input.message === 'string';
}
