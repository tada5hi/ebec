/*
 * Copyright (c) 2026.
 *  Author Peter Placzek (tada5hi)
 *  For the full copyright and license information,
 *  view the LICENSE file that was distributed with this source code.
 */

import { isObject } from './object';

export function toSerializable(input: unknown): unknown {
    if (isObject(input) && typeof input.toJSON === 'function') {
        return input.toJSON();
    }

    if (input instanceof Error) {
        return { message: input.message };
    }

    return input;
}
