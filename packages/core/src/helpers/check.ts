/*
 * Copyright (c) 2026.
 *  Author Peter Placzek (tada5hi)
 *  For the full copyright and license information,
 *  view the LICENSE file that was distributed with this source code.
 */
import type { IBaseError, IBaseErrorGroup } from '../types';
import { isErrorOptions } from '../options';
import { isError } from './error';
import { hasInstanceof } from './instanceof';
import { isObject } from './object';

// Resolved via the global Symbol.for registry — same identity as
// `BASE_ERROR_INSTANCE` exported from `../module`. Looking it up here
// avoids a circular import (module.ts → helpers → check.ts → module.ts).
const BASE_ERROR_INSTANCE = Symbol.for('@ebec/core/BaseError');

export function isBaseError(
    input: unknown,
): input is IBaseError {
    if (hasInstanceof(input, BASE_ERROR_INSTANCE)) {
        return true;
    }

    if (!isObject(input)) {
        return false;
    }

    if (
        isError(input) &&
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

    const { errors } = input as unknown as Record<string, unknown>;
    return Array.isArray(errors) && errors.every((e) => isError(e));
}
