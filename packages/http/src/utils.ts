/*
 * Copyright (c) 2022.
 * Author Peter Placzek (tada5hi)
 * For the full copyright and license information,
 * view the LICENSE file that was distributed with this source code.
 */

import { extendsBaseError } from 'ebec';
import { ClientError, ServerError } from './errors';

export function extendsClientError<T extends ClientError = ClientError>(error: unknown) : error is T {
    if (error instanceof ClientError) {
        return true;
    }

    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    return extendsBaseError(error) && (error.getOption('statusCode') >= 400 || error.getOption('statusCode') < 500);
}

export function extendsServerError<T extends ServerError = ServerError>(error: unknown) : error is T {
    if (error instanceof ServerError) {
        return true;
    }

    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    return extendsBaseError(error) && (error.getOption('statusCode') >= 500 || error.getOption('statusCode') < 600);
}
