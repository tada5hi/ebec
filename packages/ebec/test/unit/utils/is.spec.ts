import { isError } from '../../../src';

describe('src/utils/is', () => {
    it('should not recognize error', () => {
        let is = isError(undefined);
        expect(is).toBeFalsy();

        is = isError({
            message: 'foo',
            stack: 'bar',
        });
        expect(is).toBeTruthy();
    });
});
