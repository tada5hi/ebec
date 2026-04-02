/*
 * Copyright (c) 2026.
 *  Author Peter Placzek (tada5hi)
 *  For the full copyright and license information,
 *  view the LICENSE file that was distributed with this source code.
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
