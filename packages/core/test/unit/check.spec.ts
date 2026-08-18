import { describe, expect, it } from 'vitest';
import {
    BaseError,
    INSTANCEOF_PROPERTY,
    isBaseError,
    isBaseErrorGroup,
    isErrorWithCode,
} from '../../src';

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

    describe('isBaseError', () => {
        it('should reject input whose instanceof chain lacks the marker', () => {
            const announced = {
                name: 'SomethingElse',
                message: 'not a base error',
                code: 'OTHER',
                [INSTANCEOF_PROPERTY]: ['some/OtherClass'],
            };

            expect(isBaseError(announced)).toBeFalsy();
        });

        it('should reject chain-less input now that there is no shape fallback', () => {
            expect(isBaseError({ message: 'x', code: 'y' })).toBeFalsy();
        });

        it('should reject a foreign error carrying a code', () => {
            expect(isBaseError({
                name: 'PrismaError', 
                message: 'db', 
                code: 'P2002', 
            })).toBeFalsy();
        });
    });

    describe('isBaseErrorGroup', () => {
        it('should not treat an explicitly empty errors array as a group', () => {
            expect(isBaseErrorGroup(new BaseError({ errors: [] }))).toBeFalsy();
        });

        it('should treat a non-empty errors array as a group', () => {
            expect(isBaseErrorGroup(new BaseError({ errors: [new Error('a')] }))).toBeTruthy();
        });
    });
});
