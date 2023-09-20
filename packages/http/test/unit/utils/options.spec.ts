/*
 * Copyright (c) 2022.
 * Author Peter Placzek (tada5hi)
 * For the full copyright and license information,
 * view the LICENSE file that was distributed with this source code.
 */

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
