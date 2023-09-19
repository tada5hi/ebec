/*
 * Copyright (c) 2022.
 * Author Peter Placzek (tada5hi)
 * For the full copyright and license information,
 * view the LICENSE file that was distributed with this source code.
 */

import { BaseError } from '../../src';

describe('src/module.ts', () => {
    it('should create instance with message', () => {
        const message = 'foo';
        const error = new BaseError(message);

        expect(error.message).toEqual(message);
    });

    it('should create instance with options', () => {
        const error = new BaseError({
            code: 'bar',
        });
        expect(error.code).toEqual('bar');
    });
});
