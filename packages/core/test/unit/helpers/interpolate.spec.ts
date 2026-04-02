import { describe, expect, it } from 'vitest';
import { interpolate } from '../../../src/helpers/interpolate';
import { BaseError } from '../../../src';

describe('src/helpers/interpolate.ts', () => {
    it('should replace a single placeholder', () => {
        expect(interpolate('Hello {name}', { name: 'world' })).toEqual('Hello world');
    });

    it('should replace multiple placeholders', () => {
        expect(interpolate('{a} and {b}', { a: 'foo', b: 'bar' })).toEqual('foo and bar');
    });

    it('should leave missing placeholders as-is', () => {
        expect(interpolate('Hello {unknown}', { name: 'world' })).toEqual('Hello {unknown}');
    });

    it('should return message unchanged with empty data', () => {
        expect(interpolate('Hello {name}', {})).toEqual('Hello {name}');
    });

    it('should coerce non-string values to string', () => {
        expect(interpolate('{n} is {b}', { n: 42, b: true })).toEqual('42 is true');
    });

    it('should return message unchanged when no placeholders', () => {
        expect(interpolate('no placeholders here', { key: 'value' })).toEqual('no placeholders here');
    });

    it('should integrate with BaseError constructor', () => {
        const error = new BaseError({
            message: 'User {id} not found',
            messageData: { id: 123 },
        });

        expect(error.message).toEqual('User 123 not found');
    });

    it('should not interpolate when no data is provided', () => {
        const error = new BaseError({ message: 'Hello {name}' });

        expect(error.message).toEqual('Hello {name}');
    });
});
