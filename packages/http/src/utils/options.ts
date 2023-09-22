import { createExtractOptionsFn, isObject } from 'ebec';
import type { Input, Options } from '../types';
import {
    isErrorRedirectURL, isErrorStatusCodeInput, isErrorStatusMessage,
} from './is';

export function isOptions(input: unknown) : input is Options {
    if (!isObject(input)) {
        return false;
    }

    if (
        typeof input.statusCode !== 'undefined' &&
        !isErrorStatusCodeInput(input.statusCode)
    ) {
        return false;
    }

    if (
        typeof input.statusMessage !== 'undefined' &&
        !isErrorStatusMessage(input.statusMessage)
    ) {
        return false;
    }

    return typeof input.redirectURL === 'undefined' ||
        isErrorRedirectURL(input.redirectURL);
}

const check = createExtractOptionsFn(isOptions);
export function extractOptions(...input: Input[]) {
    return check(...input);
}
