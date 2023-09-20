import {
    isOptions,
} from '../../../src';

describe('src/utils/options.ts', () => {
    it('should identify input as options', () => {
        let options = isOptions({ statusCode: () => 1 });
        expect(options).toBeFalsy();

        options = isOptions({ statusCode: { foo: 'bar' } });
        expect(options).toBeFalsy();

        options = isOptions({ statusCode: 500 });
        expect(options).toBeTruthy();
    });
});
