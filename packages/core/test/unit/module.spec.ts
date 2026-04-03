/* eslint-disable max-classes-per-file */
import { describe, expect, it } from 'vitest';
import { BaseError, isBaseError } from '../../src';

describe('src/module.ts', () => {
    it('should create instance with message', () => {
        const message = 'foo';
        const error = new BaseError(message);

        expect(error.message).toEqual(message);
    });

    it('should create instance with options', () => {
        const error = new BaseError({ code: 'bar' });
        expect(error.code).toEqual('bar');
    });

    it('should default message when not provided', () => {
        const error = new BaseError();
        expect(error.message).toEqual('An error occurred');
    });

    it('should derive code from class name when not provided', () => {
        const error = new BaseError();
        expect(error.code).toEqual('BASE_ERROR');

        class NotFoundError extends BaseError {}
        const notFound = new NotFoundError();
        expect(notFound.code).toEqual('NOT_FOUND_ERROR');
    });

    it('should use explicit code over class name derivation', () => {
        const error = new BaseError({ code: 'CUSTOM' });
        expect(error.code).toEqual('CUSTOM');
    });

    it('should interpolate message with messageData without storing it', () => {
        const error = new BaseError({ message: 'User {id} not found', messageData: { id: 42 } });
        expect(error.message).toEqual('User 42 not found');
        expect((error as Record<string, unknown>).messageData).toBeUndefined();
    });

    it('should serialize with toJSON', () => {
        const error = new BaseError({ message: 'test error', code: 'TEST' });
        const json = error.toJSON();

        expect(json).toEqual({
            name: 'BaseError',
            message: 'test error',
            code: 'TEST',
        });
    });

    it('should serialize cause recursively with toJSON', () => {
        const cause = new BaseError({ message: 'inner', code: 'INNER' });
        const error = new BaseError({
            message: 'outer', 
            code: 'OUTER', 
            cause, 
        });
        const json = error.toJSON();

        expect(json).toEqual({
            name: 'BaseError',
            message: 'outer',
            code: 'OUTER',
            cause: {
                name: 'BaseError',
                message: 'inner',
                code: 'INNER',
            },
        });
    });

    it('should serialize non-BaseError cause to message object', () => {
        const cause = new Error('native');
        const error = new BaseError({ message: 'wrapped', cause });
        const json = error.toJSON();

        expect(json.cause).toEqual({ message: 'native' });
    });

    it('should recognize error', () => {
        const t1 = new class extends BaseError {

        }();

        expect(isBaseError(t1)).toBeTruthy();
    });

    it('should not recognize plain Error without code', () => {
        const error = new Error('plain');
        expect(isBaseError(error)).toBeFalsy();
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
    });
});
