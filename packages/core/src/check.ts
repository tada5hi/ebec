/*
 * Copyright (c) 2026.
 *  Author Peter Placzek (tada5hi)
 *  For the full copyright and license information,
 *  view the LICENSE file that was distributed with this source code.
 */
import { isOptions } from './options';
import { isObject } from './utils';
import { BaseError } from './module';

export function isBaseError(
    input: unknown,
): input is BaseError {
    if (!isObject(input)) {
        return false;
    }

    if (input instanceof BaseError) {
        return true;
    }

    if (!isOptions(input)) {
        return false;
    }

    return typeof input.message === 'string';
}
