import { describe, expect, it } from 'vitest';
import { isErrorOptions } from '../../../src';

describe('src/utils/options.ts', () => {
    it('should recognize input as options', () => {
        const options = isErrorOptions({ statusCode: 500 });
        expect(options).toBeTruthy();
    });

    it('should not recognize input as options', () => {
        let is = isErrorOptions(undefined);
        expect(is).toBeFalsy();

        is = isErrorOptions({ statusCode: () => 1 });
        expect(is).toBeFalsy();

        is = isErrorOptions({ statusCode: { foo: 'bar' } });
        expect(is).toBeFalsy();

        is = isErrorOptions({ statusMessage: 1 });
        expect(is).toBeFalsy();
    });
});
