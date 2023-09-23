import {
    isOptions,
} from '../../../src';

describe('src/utils/options.ts', () => {
    it('should recognize input as options', () => {
        const options = isOptions({ statusCode: 500 });
        expect(options).toBeTruthy();
    });

    it('should not recognize input as options', () => {
        let is = isOptions(undefined);
        expect(is).toBeFalsy();

        is = isOptions({ statusCode: () => 1 });
        expect(is).toBeFalsy();

        is = isOptions({ statusCode: { foo: 'bar' } });
        expect(is).toBeFalsy();

        is = isOptions({ statusMessage: 1 });
        expect(is).toBeFalsy();
    });
});
