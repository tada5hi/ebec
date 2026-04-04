import { isObject } from '@ebec/core';
import type { HTTPErrorOptions } from '../types';

export function isHTTPErrorOptions(input: unknown) : input is HTTPErrorOptions {
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