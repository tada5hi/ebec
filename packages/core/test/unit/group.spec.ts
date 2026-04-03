import { describe, expect, it } from 'vitest';
import { BaseError, isBaseErrorGroup } from '../../src';

describe('errors grouping', () => {
    it('should create instance with errors option', () => {
        const children = [new Error('a'), new Error('b')];
        const error = new BaseError({ errors: children });

        expect(error.errors).toEqual(children);
    });

    it('should have undefined errors when not provided', () => {
        const error = new BaseError('simple');
        expect(error.errors).toBeUndefined();
    });

    it('should accept empty errors array', () => {
        const error = new BaseError({ errors: [] });
        expect(error.errors).toEqual([]);
    });

    it('should recognize error group via isBaseErrorGroup', () => {
        const error = new BaseError({ errors: [new Error('child')] });
        expect(isBaseErrorGroup(error)).toBeTruthy();
    });

    it('should not recognize regular BaseError as group', () => {
        const error = new BaseError('no children');
        expect(isBaseErrorGroup(error)).toBeFalsy();
    });

    it('should not recognize non-error as group', () => {
        expect(isBaseErrorGroup(undefined)).toBeFalsy();
        expect(isBaseErrorGroup({})).toBeFalsy();
    });

    it('should include errors in toJSON when present', () => {
        const child = new BaseError({ message: 'child', code: 'CHILD' });
        const error = new BaseError({
            message: 'parent', 
            code: 'PARENT', 
            errors: [child], 
        });
        const json = error.toJSON();

        expect(json).toEqual({
            name: 'BaseError',
            message: 'parent',
            code: 'PARENT',
            errors: [{
                name: 'BaseError',
                message: 'child',
                code: 'CHILD',
            }],
        });
    });

    it('should omit errors from toJSON when not present', () => {
        const error = new BaseError({ message: 'solo', code: 'SOLO' });
        const json = error.toJSON();

        expect(json).not.toHaveProperty('errors');
    });

    it('should serialize plain Error children with message only', () => {
        const error = new BaseError({ errors: [new Error('native')] });
        const json = error.toJSON();

        expect(json.errors).toEqual([{ message: 'native' }]);
    });

    it('should serialize mixed BaseError and plain Error children', () => {
        const baseChild = new BaseError({ message: 'structured', code: 'STRUCT' });
        const plainChild = new Error('plain');
        const error = new BaseError({ errors: [baseChild, plainChild] });
        const json = error.toJSON();

        expect(json.errors).toEqual([
            {
                name: 'BaseError', 
                message: 'structured', 
                code: 'STRUCT', 
            },
            { message: 'plain' },
        ]);
    });
});
