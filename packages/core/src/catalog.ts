/*
 * Copyright (c) 2026.
 *  Author Peter Placzek (tada5hi)
 *  For the full copyright and license information,
 *  view the LICENSE file that was distributed with this source code.
 */

import { BaseError } from './module';
import type { Options } from './options';
import type { ErrorInput, ObjectLiteral } from './types';

export type CatalogEntry = {
    message?: string;
    code?: string | number;
    expose?: boolean;
    logLevel?: string | number;
};

export type ErrorCatalogDefinitions = Record<string, CatalogEntry>;

export type ErrorFactory = (
    data?: ObjectLiteral,
    ...input: ErrorInput[]
) => BaseError;

export type ErrorCatalog<T extends ErrorCatalogDefinitions> = {
    [K in keyof T]: ErrorFactory;
};

export function defineErrorCatalog<T extends ErrorCatalogDefinitions>(
    definitions: T,
): ErrorCatalog<T> {
    const catalog = {} as ErrorCatalog<T>;

    for (const key of Object.keys(definitions) as Array<keyof T & string>) {
        const entry = definitions[key] as CatalogEntry;
        catalog[key] = ((data?: ObjectLiteral, ...input: ErrorInput[]) => new BaseError({
            ...entry,
            message: entry.message,
            code: entry.code ?? key,
            data,
        } as Options, ...input)) as ErrorFactory;
    }

    return catalog;
}
