import { describe, expect, it } from 'vitest';
import type { ErrorOptions } from '../../../src';
import {
    extractErrorOptions,
    isErrorOptions,
} from '../../../src';

describe('src/options/module.ts', () => {
    it('should extract options from string', () => {
        const options = extractErrorOptions('hello');
        expect(options).toEqual({ message: 'hello' });
    });

    it('should pass through options object', () => {
        const input: ErrorOptions = { code: 'FOO', message: 'bar' };
        const options = extractErrorOptions(input);
        expect(options).toEqual({ code: 'FOO', message: 'bar' });
    });

    it('should default to empty object', () => {
        const options = extractErrorOptions();
        expect(options).toEqual({});
    });

    it('should identify valid options', () => {
        expect(isErrorOptions({ code: 'FOO' })).toBeTruthy();
        expect(isErrorOptions({ message: 'hello' })).toBeTruthy();
        expect(isErrorOptions({})).toBeTruthy();
    });

    it('should reject invalid options', () => {
        expect(isErrorOptions({ code: () => 1 })).toBeFalsy();
        expect(isErrorOptions({ message: 1 })).toBeFalsy();
        expect(isErrorOptions({ stack: 1 })).toBeFalsy();
        expect(isErrorOptions(undefined)).toBeFalsy();
        expect(isErrorOptions(null)).toBeFalsy();
    });
});
