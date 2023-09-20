import type { Options } from '../../../src';
import {
    BaseError, extractOptions, isOptions,
} from '../../../src';

describe('src/utils/options.ts', () => {
    it('should extract options', () => {
        let options : Options = {
            code: 'ERROR',
        };
        expect(options).toEqual({
            code: 'ERROR',
        } satisfies Options);

        options = extractOptions(options, { code: 'FOO' });
        expect(options).toEqual({ code: 'FOO' });

        options = extractOptions({ code: 'FOO' }, { code: undefined });
        expect(options).toEqual({ code: undefined });

        options = extractOptions({ code: 'FOO' }, { code: 0 });
        expect(options).toEqual({ code: 0 });
    });

    it('should set input error as cause option', () => {
        const error = new BaseError();
        const options = extractOptions(error, {});

        expect(options.cause).toEqual(error);
    });

    it('should identify input as options', () => {
        let options = isOptions({ code: () => 1 });
        expect(options).toBeFalsy();

        options = isOptions({ expose: 1 });
        expect(options).toBeFalsy();

        options = isOptions({ message: 1 });
        expect(options).toBeFalsy();

        options = isOptions({ logMessage: 1 });
        expect(options).toBeFalsy();

        options = isOptions({ logLevel: () => 1 });
        expect(options).toBeFalsy();
    });
});
