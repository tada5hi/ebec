/*
 * Copyright (c) 2026.
 *  Author Peter Placzek (tada5hi)
 *  For the full copyright and license information,
 *  view the LICENSE file that was distributed with this source code.
 */

import type { IBaseError } from '../types';
import { isBaseError } from './check';

export function isErrorWithCode<C extends string | number>(
    error: unknown,
    code: C | C[],
): error is IBaseError & { code: C } {
    if (!isBaseError(error)) {
        return false;
    }

    if (Array.isArray(code)) {
        return code.includes(error.code as C);
    }

    return error.code === code;
}
