import { isObject } from './is';
import type { Input, Options } from '../types';

type CheckFn<T> = (input: unknown) => input is T;
export function createExtractOptionsFn<T>(fn: CheckFn<T>) {
    return (...input: Input[]) : T => {
        let output : Options = {};
        for (let i = 0; i < input.length; i++) {
            const element = input[i];

            if (
                typeof output.cause === 'undefined' &&
                element instanceof Error
            ) {
                output.cause = element;

                continue;
            }

            if (fn(element)) {
                output = {
                    ...output,
                    ...input[i] as Options,
                };
            }
        }

        return output as T;
    };
}

export function isOptions(input: unknown) : input is Options {
    if (!isObject(input)) {
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
        typeof input.message !== 'undefined' &&
        typeof input.message !== 'string'
    ) {
        return false;
    }

    if (
        typeof input.logMessage !== 'undefined' &&
        typeof input.logMessage !== 'boolean'
    ) {
        return false;
    }

    return !(typeof input.logLevel !== 'undefined' &&
        typeof input.logLevel !== 'string' &&
        typeof input.logLevel !== 'number');
}

const check = createExtractOptionsFn(isOptions);
export function extractOptions(...input: Input[]) {
    return check(...input);
}
