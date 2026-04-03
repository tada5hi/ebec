/*
 * Copyright (c) 2026.
 *  Author Peter Placzek (tada5hi)
 *  For the full copyright and license information,
 *  view the LICENSE file that was distributed with this source code.
 */
import type { IBaseError, IBaseErrorGroup } from '../types';
import { isErrorOptions } from '../options';
import { isObject } from './object';

export function isBaseError(
    input: unknown,
): input is IBaseError {
    if (!isObject(input)) {
        return false;
    }

    if (
        input instanceof Error &&
        isErrorOptions(input)
    ) {
        return typeof input.code === 'string';
    }

    if (!isErrorOptions(input)) {
        return false;
    }

    return typeof input.message === 'string' &&
        typeof input.code === 'string';
}

export function isBaseErrorGroup(
    input: unknown,
): input is IBaseErrorGroup {
    if (!isBaseError(input)) {
        return false;
    }

    return 'errors' in input && Array.isArray((input as unknown as Record<string, unknown>).errors);
}
