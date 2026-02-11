// eslint-disable-next-line max-classes-per-file
import { describe, expect, it } from 'vitest';
import { BaseError, isBaseError } from '../../src';

describe('src/module.ts', () => {
    it('should create instance with message', () => {
        const message = 'foo';
        const error = new BaseError(message);

        expect(error.message).toEqual(message);
    });

    it('should create instance with options', () => {
        const error = new BaseError({
            code: 'bar',
        });
        expect(error.code).toEqual('bar');
    });

    it('should create instance with data', () => {
        const error = new BaseError({
            data: {
                foo: 'bar',
            },
        });
        expect(error.code).toEqual('bar');
    });

    it('should recognize error', () => {
        const t1 = new class extends BaseError {

        }();

        expect(isBaseError(t1)).toBeTruthy();

        const t2 = new class extends Error {

        }();
        expect(isBaseError(t2)).toBeTruthy();
    });

    it('should not recognize error', () => {
        let is = isBaseError(undefined);
        expect(is).toBeFalsy();

        const props = {
            message: 'foo',
            stack: 'bar',
        };

        is = isBaseError({
            ...props,
            code: () => undefined,
        });
        expect(is).toBeFalsy();

        is = isBaseError({
            ...props,
            expose: '',
        });
        expect(is).toBeFalsy();

        is = isBaseError({
            ...props,
            logMessage: '',
        });
        expect(is).toBeFalsy();

        is = isBaseError({
            ...props,
            logLevel: null,
        });
        expect(is).toBeFalsy();
    });
});
