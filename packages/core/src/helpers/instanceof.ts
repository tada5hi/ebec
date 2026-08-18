/*
 * Copyright (c) 2026.
 *  Author Peter Placzek (tada5hi)
 *  For the full copyright and license information,
 *  view the LICENSE file that was distributed with this source code.
 */

import { isObject } from './object';

/**
 * Property name used to store the cross-realm class-marker chain on instances.
 *
 * The chain is a `symbol[]` of `Symbol.for(...)` markers — one per class in the
 * inheritance path. Stored as a non-enumerable, non-writable, non-configurable
 * property so it stays out of `Object.keys()` and plain `JSON.stringify()`
 * output. `BaseError.toJSON()` re-emits it under the same key as a string
 * list (see {@link serializeInstanceofChain}), so on objects rehydrated from
 * that JSON the property holds a `string[]` instead.
 *
 * A well-formed chain always begins with `BASE_ERROR_INSTANCE` — every real
 * ebec error is a `BaseError` first, and subclass markers are appended on
 * top of it. Hand-built cross-realm stand-ins that carry a subclass marker
 * without it can invert that hierarchy (e.g. matching `@ebec/http`'s
 * `isHTTPError` while failing `@ebec/core`'s `isBaseError`).
 */
export const INSTANCEOF_PROPERTY = '@instanceof' as const;

/**
 * Append a class-marker symbol to the receiver's `@instanceof` chain.
 *
 * Each error class declares a `Symbol.for(...)` marker for itself and calls
 * `markInstanceof(this, MY_MARKER)` from its constructor. Subclass instances
 * accumulate markers from every ancestor in the chain, so a parent-class
 * guard can fast-path-match a subclass instance.
 *
 * Idempotent — re-marking the same instance with the same symbol is a no-op.
 */
export function markInstanceof(target: object, marker: symbol): void {
    const existing = (target as Record<string, unknown>)[INSTANCEOF_PROPERTY];
    if (Array.isArray(existing)) {
        if (!existing.includes(marker)) {
            existing.push(marker);
        }
        return;
    }

    Object.defineProperty(target, INSTANCEOF_PROPERTY, {
        value: [marker],
        writable: false,
        enumerable: false,
        configurable: false,
    });
}

/**
 * Check whether the input's `@instanceof` chain carries `marker`.
 *
 * Returns `false` for non-objects, objects without the chain, or chains
 * stored as a non-array value (defensive).
 *
 * `strict` controls which chain entries count as a match. By default
 * (`strict: true`) only the native `Symbol.for(...)` form matches, which is
 * what an in-process instance carries. Pass `strict: false` to also match
 * the marker's `description` string: symbols are dropped by
 * `JSON.stringify`, so an error rehydrated from the JSON emitted by
 * `BaseError.toJSON()` carries the marker's description string in its chain
 * instead of the symbol, and only the loose form still recognizes it.
 * {@link matchesInstanceof} is `hasInstanceof(input, marker, false)`.
 */
export function hasInstanceof(input: unknown, marker: symbol, strict: boolean = true): boolean {
    if (!isObject(input)) {
        return false;
    }

    const chain = input[INSTANCEOF_PROPERTY];

    if (!Array.isArray(chain)) {
        return false;
    }

    if (chain.includes(marker)) {
        return true;
    }

    if (strict) {
        return false;
    }

    return typeof marker.description === 'string' &&
        chain.includes(marker.description);
}

/**
 * Serialize the input's `@instanceof` class-marker chain to its string form.
 *
 * Symbols are dropped by `JSON.stringify`, so `BaseError.toJSON()` emits the
 * chain as the markers' description strings instead. For `Symbol.for(...)`
 * markers the description *is* the registry key, so the string form carries
 * the same identity information as the symbol form.
 *
 * String entries pass through unchanged (a rehydrated chain re-serializes
 * losslessly); anything else is dropped. Each value is emitted once — a
 * re-marked rehydrated chain can hold the same marker in both its string
 * and symbol form.
 */
export function serializeInstanceofChain(input: unknown): string[] {
    if (!isObject(input)) {
        return [];
    }

    const chain = input[INSTANCEOF_PROPERTY];
    if (!Array.isArray(chain)) {
        return [];
    }

    const output: string[] = [];
    for (const entry of chain) {
        let value: string | undefined;
        if (typeof entry === 'symbol') {
            if (entry.description) {
                value = entry.description;
            }
        } else if (typeof entry === 'string') {
            value = entry;
        }

        if (typeof value === 'string' && !output.includes(value)) {
            output.push(value);
        }
    }

    return output;
}

/**
 * Check whether the input's `@instanceof` chain carries `marker` — either as
 * the native registry symbol (an in-process instance) or as the symbol's
 * description string (an error rehydrated from the JSON emitted by
 * `BaseError.toJSON()`).
 *
 * Prefer this over the strict (default) form of {@link hasInstanceof} as the
 * fast path of duck-type guards. Guards have no shape-based fallback, so the
 * strict form is the only check one performs: it matches only the symbol
 * form, so a guard built on it returns `false` outright for a
 * JSON-rehydrated subclass error — there is no slower path to fall back to.
 * Equivalent to `hasInstanceof(input, marker, false)`.
 */
export function matchesInstanceof(input: unknown, marker: symbol): boolean {
    return hasInstanceof(input, marker, false);
}
