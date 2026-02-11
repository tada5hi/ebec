/*
 * Copyright (c) 2026.
 *  Author Peter Placzek (tada5hi)
 *  For the full copyright and license information,
 *  view the LICENSE file that was distributed with this source code.
 */

import {
    isObject,
} from '../utils';
import type { ErrorInput } from '../types';
import { isError } from './check';
import type { Options } from './types';

type CheckFn<T> = (input: unknown) => input is T;
export function createExtractOptionsFn<T extends Options>(fn: CheckFn<T>) {
    return (...input: ErrorInput[]) : T => {
        const output : T = {} as T;
        for (let i = 0; i < input.length; i++) {
            const element = input[i];

            if (typeof element === 'string') {
                output.message = element;
                continue;
            }

            // message,stack & cause are not enumerable
            if (isError(element)) {
                output.message = element.message;
                output.stack = element.stack;
                output.cause = element;
            }

            // if element prototype is not of instance Error,
            // then message, stack & cause get extracted here.
            if (fn(element)) {
                const keys = Object.keys(element);
                for (let i = 0; i < keys.length; i++) {
                    output[keys[i] as keyof T] = element[keys[i] as keyof T];
                }
            }
        }

        return output;
    };
}

export function isOptions(input: unknown) : input is Options {
    if (!isObject(input)) {
        return false;
    }

    if (
        typeof input.message !== 'undefined' &&
        typeof input.message !== 'string'
    ) {
        return false;
    }

    if (
        typeof input.stack !== 'undefined' &&
        typeof input.stack !== 'string'
    ) {
        return false;
    }

    if (
        typeof input.code !== 'undefined' &&
        typeof input.code !== 'number' &&
        typeof input.code !== 'string' &&
        input.code !== null
    ) {
        return false;
    }

    if (
        typeof input.expose !== 'undefined' &&
        typeof input.expose !== 'boolean'
    ) {
        return false;
    }

    if (
        typeof input.logMessage !== 'undefined' &&
        typeof input.logMessage !== 'boolean'
    ) {
        return false;
    }

    return typeof input.logLevel === 'undefined' ||
        typeof input.logLevel === 'number' ||
        typeof input.logLevel === 'string';
}

const check = createExtractOptionsFn(isOptions);
export function extractOptions(...input: ErrorInput[]) {
    return check(...input);
}
