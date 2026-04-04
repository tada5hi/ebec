import { describe, expect, it } from 'vitest';
import { isHTTPErrorOptions } from '../../../src';

describe('src/utils/options.ts', () => {
    it('should recognize input as options', () => {
        const options = isHTTPErrorOptions({ statusCode: 500 });
        expect(options).toBeTruthy();
    });

    it('should not recognize input as options', () => {
        let is = isHTTPErrorOptions(undefined);
        expect(is).toBeFalsy();

        is = isHTTPErrorOptions({ statusCode: () => 1 });
        expect(is).toBeFalsy();

        is = isHTTPErrorOptions({ statusCode: { foo: 'bar' } });
        expect(is).toBeFalsy();

        is = isHTTPErrorOptions({ statusMessage: 1 });
        expect(is).toBeFalsy();
    });
});
