import { describe, expect, it } from 'vitest';
import { BaseError, isErrorWithCode } from '../../src';

describe('src/check.ts', () => {
    describe('isErrorWithCode', () => {
        it('should match string code', () => {
            const error = new BaseError({ code: 'FOO' });
            expect(isErrorWithCode(error, 'FOO')).toBe(true);
        });

        it('should reject mismatched string code', () => {
            const error = new BaseError({ code: 'FOO' });
            expect(isErrorWithCode(error, 'BAR')).toBe(false);
        });

        it('should match numeric code', () => {
            const error = new BaseError({ code: 42 });
            expect(isErrorWithCode(error, 42)).toBe(true);
        });

        it('should match code in array', () => {
            const error = new BaseError({ code: 'A' });
            expect(isErrorWithCode(error, ['A', 'B'])).toBe(true);
        });

        it('should reject code not in array', () => {
            const error = new BaseError({ code: 'C' });
            expect(isErrorWithCode(error, ['A', 'B'])).toBe(false);
        });

        it('should return false for undefined', () => {
            expect(isErrorWithCode(undefined, 'FOO')).toBe(false);
        });

        it('should return false for plain Error', () => {
            expect(isErrorWithCode(new Error(), 'FOO')).toBe(false);
        });
    });
});
