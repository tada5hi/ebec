/*
 * Copyright (c) 2022-2022.
 * Author Peter Placzek (tada5hi)
 * For the full copyright and license information,
 * view the LICENSE file that was distributed with this source code.
 */

// eslint-disable-next-line max-classes-per-file
import { BaseError, extendsBaseError } from '../../src';

describe('src/utils/extends.ts', () => {
    it('should determine inheritance', () => {
        const error = new class extends BaseError {

        }();

        expect(extendsBaseError(error)).toBeTruthy();

        const secondError = new class extends Error {

        }();
        expect(extendsBaseError(secondError)).toBeFalsy();

        try {
            throw error;
        } catch (e) {
            expect(extendsBaseError(e)).toBeTruthy();
        }
    });

    it('should (not) determine lazy inheritance', () => {
        let ob : Record<string, any> = {
            options: {},
            getOption: null,
            getOptions: null,
        };
        expect(extendsBaseError(ob)).toBeFalsy();

        ob = {
            options: {},
            getOption: () => null,
            getOptions: () => null,
        };
        expect(extendsBaseError(ob)).toBeTruthy();
    });
});
