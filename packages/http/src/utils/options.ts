import { createExtractOptionsFn, isObject } from 'ebec';
import type { Input, Options } from '../types';

export function isOptions(input: unknown) : input is Options {
    if (!isObject(input)) {
        return false;
    }

    if (
        typeof input.statusCode !== 'undefined' &&
        typeof input.statusCode !== 'number' &&
        typeof input.statusCode !== 'string'
    ) {
        return false;
    }

    if (
        typeof input.statusMessage !== 'undefined' &&
        typeof input.statusMessage !== 'string'
    ) {
        return false;
    }

    return typeof input.redirectURL === 'undefined' ||
        typeof input.redirectURL === 'string';
}

const check = createExtractOptionsFn(isOptions);
export function extractOptions(...input: Input[]) {
    return check(...input);
}
