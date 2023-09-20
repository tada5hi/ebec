// eslint-disable-next-line max-classes-per-file
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

    it('should recognize instance', () => {
        const error = new class extends BaseError {

        }();

        expect(isBaseError(error)).toBeTruthy();

        const secondError = new class extends Error {

        }();
        expect(isBaseError(secondError)).toBeTruthy();

        try {
            throw error;
        } catch (e) {
            expect(isBaseError(e)).toBeTruthy();
        }
    });
});
