/*
 * Copyright (c) 2022.
 * Author Peter Placzek (tada5hi)
 * For the full copyright and license information,
 * view the LICENSE file that was distributed with this source code.
 */

import { BaseError, Options } from '../../src';

describe('src/module.ts', () => {
    it('should create instance with message', () => {
        const message = 'foo';
        const error = new BaseError(message);

        expect(error.message).toEqual(message);
        expect(error.options).toEqual({});
    });

    it('should create instance with options', () => {
        let error = new BaseError({
            statusCode: 404,
        });
        expect(error.message).toEqual('');
        expect(error.options.statusCode).toEqual(404);

        error.setOptions();

        expect(error.getOption('foo')).toBeUndefined();
        error.setOptions({ foo: 'bar' });
        expect(error.getOption('foo')).toEqual('bar');

        error = new BaseError({
            message: 'foo',
        });
        expect(error.message).toEqual('foo');

        error = new BaseError('foo', {
            message: 'bar',
            code: 'ERROR',
        });
        expect(error.message).toEqual('foo');
        expect(Object.keys(error.options).length).toEqual(2);
        expect(error.options.message).toEqual('bar');
        expect(error.options.code).toEqual('ERROR');
    });

    it('get/set error options', () => {
        const error = new BaseError();
        error.setOption('statusCode', 404);

        expect(error.getOption('statusCode')).toEqual(404);
        expect(error.getOption('logMessage')).toBeUndefined();

        error.setOption('logMessage', true);
        expect(error.getOption('logMessage')).toEqual(true);

        error.unsetOption('logMessage');
        expect(error.getOption('logMessage')).toBeUndefined();

        expect(error.getOptions()).toEqual({
            statusCode: error.getOption('statusCode'),
        } as Options);
    });
});
