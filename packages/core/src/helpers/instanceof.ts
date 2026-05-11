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
 * property so it stays out of `Object.keys()` and `JSON.stringify()` output.
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
 * Check whether the input's `@instanceof` chain contains `marker`.
 *
 * Returns `false` for non-objects, objects without the chain, or chains
 * stored as a non-array value (defensive).
 */
export function hasInstanceof(input: unknown, marker: symbol): boolean {
    if (!isObject(input)) {
        return false;
    }

    const chain = input[INSTANCEOF_PROPERTY];
    return Array.isArray(chain) && chain.includes(marker);
}
