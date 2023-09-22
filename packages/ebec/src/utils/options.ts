import {
    isErrorCode, isErrorExpose, isErrorLogLevel, isErrorLogMessage, isErrorMessage, isObject,
} from './is';
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
        typeof input.message !== 'undefined' &&
        !isErrorMessage(input.message)
    ) {
        return false;
    }

    if (
        typeof input.code !== 'undefined' &&
        !isErrorCode(input.code)
    ) {
        return false;
    }

    if (
        typeof input.expose !== 'undefined' &&
        !isErrorExpose(input.expose)
    ) {
        return false;
    }

    if (
        typeof input.logMessage !== 'undefined' &&
        !isErrorLogMessage(input.logMessage)
    ) {
        return false;
    }

    return typeof input.logLevel === 'undefined' ||
        isErrorLogLevel(input.logLevel);
}

const check = createExtractOptionsFn(isOptions);
export function extractOptions(...input: Input[]) {
    return check(...input);
}
