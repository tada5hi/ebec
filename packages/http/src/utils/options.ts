import { isObject } from '@ebec/core';
import type { HTTPErrorOptions } from '../types';

export function isHTTPErrorOptions(input: unknown) : input is HTTPErrorOptions {
    if (!isObject(input)) {
        return false;
    }

    if (
        typeof input.status !== 'undefined' &&
        typeof input.status !== 'number' &&
        typeof input.status !== 'string'
    ) {
        return false;
    }

    if (
        typeof input.statusCode !== 'undefined' &&
        typeof input.statusCode !== 'number' &&
        typeof input.statusCode !== 'string'
    ) {
        return false;
    }

    return typeof input.redirectURL === 'undefined' ||
        typeof input.redirectURL === 'string';
}