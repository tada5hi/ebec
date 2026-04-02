/*
 * Copyright (c) 2026.
 *  Author Peter Placzek (tada5hi)
 *  For the full copyright and license information,
 *  view the LICENSE file that was distributed with this source code.
 */
import type { IBaseError } from '../types';
import { isOptions } from '../options';
import { isObject } from './object';

export function isBaseError(
    input: unknown,
): input is IBaseError {
    if (!isObject(input)) {
        return false;
    }

    if (
        input instanceof Error &&
        isOptions(input)
    ) {
        return true;
    }

    if (!isOptions(input)) {
        return false;
    }

    return typeof input.message === 'string';
}
