/*
 * Copyright (c) 2022.
 * Author Peter Placzek (tada5hi)
 * For the full copyright and license information,
 * view the LICENSE file that was distributed with this source code.
 */

import type { Options } from '../../../src';
import {
    BaseError, extractOptions,
} from '../../../src';

describe('src/utils/options.ts', () => {
    it('should merge options', () => {
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

    it('should build options', () => {
        const error = new BaseError();
        const options = extractOptions(error, {});

        expect(options.cause).toEqual(error);
    });
});
