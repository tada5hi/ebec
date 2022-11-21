/*
 * Copyright (c) 2022-2022.
 * Author Peter Placzek (tada5hi)
 * For the full copyright and license information,
 * view the LICENSE file that was distributed with this source code.
 */

import { BaseError } from './module';
import { hasOwnProperty } from './utils';

function isObject(item: unknown) : item is Record<string, any> {
    return (!!item && typeof item === 'object' && !Array.isArray(item));
}

function isFunction(item: unknown) : item is CallableFunction {
    return typeof item === 'function';
}

export function extendsBaseError<T extends BaseError = BaseError>(error: unknown) : error is T {
    if (error instanceof BaseError) {
        return true;
    }

    return !!(isObject(error) &&
        hasOwnProperty(error, 'options') &&
        isObject(error.options) &&
        hasOwnProperty(error, 'getOption') &&
        isFunction(error.getOption) &&
        hasOwnProperty(error, 'getOptions') &&
        isFunction(error.getOptions));
}
