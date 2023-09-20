import { isObject } from './is';
import type { Input } from '../types';

export function extractMessage(...input: Input[]) : string | undefined {
    for (let i = 0; i < input.length; i++) {
        const item = input[i];
        if (typeof item === 'string') {
            return item;
        }

        if (
            isObject(item) &&
            typeof item.message === 'string'
        ) {
            return item.message;
        }
    }

    return undefined;
}
