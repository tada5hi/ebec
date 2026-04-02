/*
 * Copyright (c) 2026.
 *  Author Peter Placzek (tada5hi)
 *  For the full copyright and license information,
 *  view the LICENSE file that was distributed with this source code.
 */

import type { ErrorOptions } from './options';

export type ErrorInput = string | ErrorOptions;

export interface IBaseError {
    message: string;
    stack?: string;
    cause?: unknown;
    code: string;
}
