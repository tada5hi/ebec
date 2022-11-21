/*
 * Copyright (c) 2022.
 * Author Peter Placzek (tada5hi)
 * For the full copyright and license information,
 * view the LICENSE file that was distributed with this source code.
 */

import { Options } from 'ebec';

export type HTTPOptions = Omit<Options, 'statusCode' | 'code' | 'decorateMessage' | 'logMessage'> & Required<{
    [K in keyof Pick<Options, 'code' | 'statusCode' | 'decorateMessage' | 'logMessage'>]: NonNullable<Options[K]>
}>;
