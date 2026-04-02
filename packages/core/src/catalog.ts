/*
 * Copyright (c) 2026.
 *  Author Peter Placzek (tada5hi)
 *  For the full copyright and license information,
 *  view the LICENSE file that was distributed with this source code.
 */

import { BaseError } from './module';
import type { ErrorOptions } from './options';

export type ErrorCatalogEntry = {
    message?: string;
    code?: string;
};

export type ErrorCatalogDefinitions = Record<string, ErrorCatalogEntry>;

export type ErrorFactory = (
    messageData?: Record<string, unknown>,
    overrides?: ErrorOptions,
) => BaseError;

export type ErrorCatalog<T extends ErrorCatalogDefinitions> = {
    [K in keyof T]: ErrorFactory;
};

export function defineErrorCatalog<T extends ErrorCatalogDefinitions>(
    definitions: T,
): ErrorCatalog<T> {
    const catalog = {} as ErrorCatalog<T>;

    for (const key of Object.keys(definitions) as Array<keyof T & string>) {
        const entry = definitions[key] as ErrorCatalogEntry;
        catalog[key] = ((messageData?: Record<string, unknown>, overrides: ErrorOptions = {}) => new BaseError({
            ...entry,
            ...overrides,
            code: overrides.code ?? entry.code ?? key,
            message: overrides.message ?? entry.message,
            messageData: overrides.messageData ?? messageData,
        })) as ErrorFactory;
    }

    return catalog;
}
