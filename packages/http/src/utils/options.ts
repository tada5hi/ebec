import { isObject } from '@ebec/core';
import type { ErrorInput, ErrorOptions } from '../types';

export function isErrorOptions(input: unknown) : input is ErrorOptions {
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

export function extractErrorOptions(input: ErrorInput = {}): ErrorOptions {
    if (typeof input === 'string') {
        return { message: input };
    }

    return input;
}
