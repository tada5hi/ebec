/*
 * Copyright (c) 2026.
 * Author Peter Placzek (tada5hi)
 * For the full copyright and license information,
 * view the LICENSE file that was distributed with this source code.
 */

import { describe, expect, it } from 'vitest';
import { IssueCode } from '../../../src';

describe('IssueCode vocabulary', () => {
    // The vocabulary is the contract producers map onto and i18n catalogs
    // translate from. These tests anchor the convention: UPPER_SNAKE keys,
    // lower_snake_case values, no drift between the docs and the const.

    it('exposes every documented code on the const', () => {
        // Regression guard: every code listed in the README's Issue Codes
        // table must be reachable on the runtime const. If a code is renamed
        // or removed without updating the table, this catches it.
        expect(Object.values(IssueCode)).toEqual([
            'value_invalid',
            'one_of_failed',
            'required',
            'alpha',
            'alpha_num',
            'numeric',
            'integer',
            'decimal',
            'min_length',
            'max_length',
            'min_value',
            'max_value',
            'between',
            'email',
            'url',
            'ip_address',
            'mac_address',
            'uuid',
            'date',
            'pattern',
            'json',
            'base64',
            'strong_password',
            'same_as',
        ]);
    });

    it('uses lower_snake_case for every runtime code value', () => {
        // Producers and i18n catalogs key off the runtime string. Anchor the
        // casing so a future PR adding `MyNewCode: 'myNewCode'` fails here
        // instead of silently shipping the inconsistency.
        const snakeCase = /^[a-z][a-z0-9]*(?:_[a-z0-9]+)*$/;
        for (const value of Object.values(IssueCode)) {
            expect(value, `IssueCode value "${value}" must be lower_snake_case`)
                .toMatch(snakeCase);
        }
    });

    it('aligns const keys 1:1 with their runtime values (UPPER_SNAKE ↔ lower_snake)', () => {
        // Anchors the documented convention — every UPPER_SNAKE key must be
        // the literal-uppercase form of its lower_snake_case value.
        for (const [key, value] of Object.entries(IssueCode)) {
            expect(key, `key "${key}" must be the UPPER_SNAKE form of value "${value}"`)
                .toBe(value.toUpperCase());
        }
    });

    it('holds no duplicate values', () => {
        const values = Object.values(IssueCode);

        expect(new Set(values).size).toBe(values.length);
    });
});
