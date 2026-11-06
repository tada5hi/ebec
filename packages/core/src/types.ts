/*
 * Copyright (c) 2026.
 *  Author Peter Placzek (tada5hi)
 *  For the full copyright and license information,
 *  view the LICENSE file that was distributed with this source code.
 */

import type { Issue } from './issue';
import type { ErrorOptions } from './options';

import type { BaseError } from './module';

export type ErrorInput = string | ErrorOptions;

export interface IBaseError extends Error {
    cause?: unknown;
    code: string;
    errors?: ReadonlyArray<Error>;
    issues?: ReadonlyArray<Issue>;
}

export interface IBaseErrorGroup extends IBaseError {
    errors: ReadonlyArray<Error>;
}

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
