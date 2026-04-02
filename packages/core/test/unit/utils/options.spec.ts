import { describe, expect, it } from 'vitest';
import type { Options } from '../../../src';
import {
    BaseError,
    extractOptions, 
    isOptions,
} from '../../../src';

describe('src/utils/options.ts', () => {
    it('should extract options', () => {
        let options : Options = { code: 'ERROR' };
        expect(options).toEqual({ code: 'ERROR' } satisfies Options);

        options = extractOptions(options, { code: 'FOO' });
        expect(options).toEqual({ code: 'FOO' });

        options = extractOptions({ code: 'FOO' }, { code: undefined });
        expect(options).toEqual({ code: undefined });

        options = extractOptions({ code: 'FOO' }, { code: 0 });
        expect(options).toEqual({ code: 0 });
    });

    it('should set input error as cause option', () => {
        const baseError = new BaseError('foo', { stack: 'myStack' });
        const options = extractOptions(baseError, { code: 'BAR' });

        expect(options.message).toEqual('foo');
        expect(options.code).toEqual('BAR');
        expect(options.stack).toEqual('myStack');
    });

    it('should filter prototype pollution keys', () => {
        const malicious = Object.create(null);
        malicious.code = 'SAFE';
        Object.defineProperty(malicious, '__proto__', {
            value: { polluted: true },
            enumerable: true,
        });
        Object.defineProperty(malicious, 'constructor', {
            value: { polluted: true },
            enumerable: true,
        });
        Object.defineProperty(malicious, 'prototype', {
            value: { polluted: true },
            enumerable: true,
        });

        const options = extractOptions(malicious);
        expect(options.code).toEqual('SAFE');
        expect(Object.prototype.hasOwnProperty.call(options, '__proto__')).toBe(false);
        expect(Object.prototype.hasOwnProperty.call(options, 'constructor')).toBe(false);
        expect(Object.prototype.hasOwnProperty.call(options, 'prototype')).toBe(false);
    });

    it('should identify input as options', () => {
        let options = isOptions({ code: () => 1 });
        expect(options).toBeFalsy();

        options = isOptions({ expose: 1 });
        expect(options).toBeFalsy();

        options = isOptions({ message: 1 });
        expect(options).toBeFalsy();

        options = isOptions({ logMessage: 1 });
        expect(options).toBeFalsy();

        options = isOptions({ logLevel: () => 1 });
        expect(options).toBeFalsy();

        options = isOptions({ stack: 1 });
        expect(options).toBeFalsy();
    });
});
