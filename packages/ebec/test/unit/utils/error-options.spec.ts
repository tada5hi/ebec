/*
 * Copyright (c) 2022.
 * Author Peter Placzek (tada5hi)
 * For the full copyright and license information,
 * view the LICENSE file that was distributed with this source code.
 */

import exp from 'constants';
import {
    BaseError, Options, buildOptions, mergeOptions, setUnsetOptions,
} from '../../../src';

describe('src/utils/error-options.ts', () => {
    it('should merge options', () => {
        let options = mergeOptions({
            statusCode: 404,
        }, {
            code: 'ERROR',
        });
        expect(options).toEqual({
            statusCode: 404,
            code: 'ERROR',
        } as Options);

        options = mergeOptions({ }, { code: 'FOO' });
        expect(options).toEqual({ code: 'FOO' });
    });

    it('should set un-set options', () => {
        let options = setUnsetOptions({}, { code: 'ERROR' });
        expect(options).toEqual({ code: 'ERROR' } as Options);

        options = setUnsetOptions({ code: 'FOO' }, { code: 'BAR' });
        expect(options).toEqual({ code: 'FOO' });

        options = setUnsetOptions({ code: null }, { code: 'FOO' });
        expect(options).toEqual({ code: null });

        options = setUnsetOptions({ code: undefined }, { code: 'FOO' });
        expect(options).toEqual({ code: undefined });

        options = setUnsetOptions({ code: 0 }, { code: 'FOO' });
        expect(options).toEqual({ code: 0 });
    });

    it('should build options', () => {
        const error = new BaseError();
        const options = buildOptions(error, {});

        expect(options.previous).toEqual(error);
    });
});
