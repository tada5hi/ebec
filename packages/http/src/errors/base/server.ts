/*
 * Copyright (c) 2022.
 * Author Peter Placzek (tada5hi)
 * For the full copyright and license information,
 * view the LICENSE file that was distributed with this source code.
 */

import { isOptions as isBaseOptions } from 'ebec';
import { isOptions } from '../../utils';
import { HTTPError } from './http';

export class ServerError extends HTTPError {

}

export function extendsServerError(error: unknown): error is ServerError {
    if (error instanceof ServerError) {
        return true;
    }

    if (!isOptions(error) || !isBaseOptions(error)) {
        return false;
    }

    return typeof error.statusCode === 'number';
}
