import { describe, expect, it } from 'vitest';
import { BaseError, defineErrorCatalog } from '../../src';

describe('src/catalog.ts', () => {
    it('should create a catalog with factories', () => {
        const catalog = defineErrorCatalog({ NOT_FOUND: { message: 'Resource not found', code: 'NOT_FOUND' } });

        const error = catalog.NOT_FOUND();
        expect(error).toBeInstanceOf(BaseError);
        expect(error.message).toEqual('Resource not found');
        expect(error.code).toEqual('NOT_FOUND');
    });

    it('should default code to key name', () => {
        const catalog = defineErrorCatalog({ SOMETHING_WRONG: { message: 'Oops' } });

        const error = catalog.SOMETHING_WRONG();
        expect(error.code).toEqual('SOMETHING_WRONG');
    });

    it('should interpolate message from data', () => {
        const catalog = defineErrorCatalog({ NOT_FOUND: { message: 'User {id} not found' } });

        const error = catalog.NOT_FOUND({ id: 42 });
        expect(error.message).toEqual('User 42 not found');
    });

    it('should leave missing placeholders as-is', () => {
        const catalog = defineErrorCatalog({ ERR: { message: 'Missing {field}' } });

        const error = catalog.ERR({ other: 'value' });
        expect(error.message).toEqual('Missing {field}');
    });

    it('should allow overriding via options', () => {
        const catalog = defineErrorCatalog({ ERR: { message: 'original', code: 'ERR' } });

        const error = catalog.ERR(undefined, { message: 'overridden message' });
        expect(error.message).toEqual('overridden message');
    });

    it('should handle empty catalog', () => {
        const catalog = defineErrorCatalog({});
        expect(Object.keys(catalog)).toHaveLength(0);
    });

    it('should work with no data argument', () => {
        const catalog = defineErrorCatalog({ GENERIC: { message: 'Something went wrong' } });

        const error = catalog.GENERIC();
        expect(error.message).toEqual('Something went wrong');
    });
});
