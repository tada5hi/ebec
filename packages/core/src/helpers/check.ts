/*
 * Copyright (c) 2026.
 *  Author Peter Placzek (tada5hi)
 *  For the full copyright and license information,
 *  view the LICENSE file that was distributed with this source code.
 */
import type { IBaseError, IBaseErrorGroup } from '../types';
import { isError } from './error';
import { matchesInstanceof } from './instanceof';

// Resolved via the global Symbol.for registry — same identity as
// `BASE_ERROR_INSTANCE` exported from `../module`. Looking it up here
// avoids a circular import (module.ts → helpers → check.ts → module.ts).
const BASE_ERROR_INSTANCE = Symbol.for('@ebec/core/BaseError');

// Identity is chain-only: an input either carries the BaseError marker
// (natively, or as the marker's description string after a JSON round-trip)
// or it isn't a BaseError. There is no shape-based fallback — an object that
// merely looks like one (a foreign library's error carrying a `code`, a
// hand-built `{ message, code }`) no longer matches.
export function isBaseError(
    input: unknown,
): input is IBaseError {
    return matchesInstanceof(input, BASE_ERROR_INSTANCE);
}

export function isBaseErrorGroup(
    input: unknown,
): input is IBaseErrorGroup {
    if (!isBaseError(input)) {
        return false;
    }

    const { errors } = input as unknown as Record<string, unknown>;
    return Array.isArray(errors) && errors.length > 0 && errors.every((e) => isError(e));
}
