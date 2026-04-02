/*
 * Copyright (c) 2026.
 *  Author Peter Placzek (tada5hi)
 *  For the full copyright and license information,
 *  view the LICENSE file that was distributed with this source code.
 */

import { isObject } from '../helpers';
import type { ErrorOptions } from './types';

export function isErrorOptions(input: unknown) : input is ErrorOptions {
    if (!isObject(input)) {
        return false;
    }

    if (
        typeof input.message !== 'undefined' &&
        typeof input.message !== 'string'
    ) {
        return false;
    }

    if (
        typeof input.stack !== 'undefined' &&
        typeof input.stack !== 'string'
    ) {
        return false;
    }

    return typeof input.code === 'undefined' ||
        typeof input.code === 'string';
}

export function extractErrorOptions(input: string | ErrorOptions = {}): ErrorOptions {
    if (typeof input === 'string') {
        return { message: input };
    }

    return input;
}
