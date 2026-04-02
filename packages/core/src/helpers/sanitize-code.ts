/*
 * Copyright (c) 2026.
 *  Author Peter Placzek (tada5hi)
 *  For the full copyright and license information,
 *  view the LICENSE file that was distributed with this source code.
 */

/**
 * Convert a PascalCase class name to CONSTANT_CASE error code.
 * e.g. "NotFoundError" -> "NOT_FOUND_ERROR"
 */
export function sanitizeErrorCode(input: string): string {
    return input
        .replace(/([a-z])([A-Z])/g, '$1_$2')
        .replace(/([A-Z]+)([A-Z][a-z])/g, '$1_$2')
        .toUpperCase();
}
