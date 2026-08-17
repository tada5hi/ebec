/*
 * Copyright (c) 2026.
 *  Author Peter Placzek (tada5hi)
 *  For the full copyright and license information,
 *  view the LICENSE file that was distributed with this source code.
 */

/**
 * Substitute `{name}` placeholders in `str` with values from `data`.
 *
 * Placeholders whose key is missing from `data` (or explicitly
 * `undefined`) are left in the string verbatim, so a partially-populated
 * `data` degrades to a readable template rather than to `"undefined"`.
 *
 * - `regex` must carry the `g` flag — `String.prototype.matchAll` throws
 *   without it.
 * - Substitution goes through `String.prototype.replace` with a string
 *   replacement, so `$&`, `` $` ``, `$'` and `$1` inside a *substituted
 *   value* are interpreted as replacement patterns rather than literals.
 *   Treat `data` values as trusted, or escape `$` before passing them.
 */
export function interpolate(
    str: string,
    data: Record<string, unknown>,
    regex = /\{(\w+)\}/g,
): string {
    return Array.from(str.matchAll(regex))
        .reduce((acc, match) => {
            const key = match[1];
            if (key && typeof data[key] !== 'undefined') {
                return acc.replace(match[0], String(data[key]));
            }

            return acc;
        }, str);
}
