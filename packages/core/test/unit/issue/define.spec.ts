/*
 * Copyright (c) 2026.
 * Author Peter Placzek (tada5hi)
 * For the full copyright and license information,
 * view the LICENSE file that was distributed with this source code.
 */

import { describe, expect, it } from 'vitest';
import {
    IssueCode,
    defineIssueGroup,
    defineIssueItem,
} from '../../../src';

describe('defineIssueItem', () => {
    it('stamps the item discriminant', () => {
        expect(defineIssueItem({ path: [], message: 'foo' }).type).toBe('item');
    });

    it('preserves a user-provided code', () => {
        const item = defineIssueItem({
            path: ['email'],
            message: 'Email is invalid',
            code: 'email_invalid',
        });

        expect(item.code).toBe('email_invalid');
    });

    it('falls back to VALUE_INVALID when no code is provided', () => {
        const item = defineIssueItem({
            path: ['email'],
            message: 'Email is invalid',
        });

        expect(item.code).toBe(IssueCode.VALUE_INVALID);
    });

    it('falls back to VALUE_INVALID for an empty-string code', () => {
        // The runtime gate is `||`, not `??` — an empty code is not a code.
        const item = defineIssueItem({
            path: [], 
            message: 'x', 
            code: '', 
        });

        expect(item.code).toBe(IssueCode.VALUE_INVALID);
    });

    it('carries the passthrough fields through', () => {
        const item = defineIssueItem({
            path: ['age'],
            message: 'nope',
            code: 'custom',
            received: 'abc',
            expected: 'a number',
            meta: { external: true },
            data: { hint: 'x' },
        });

        expect(item).toEqual({
            type: 'item',
            path: ['age'],
            message: 'nope',
            code: 'custom',
            received: 'abc',
            expected: 'a number',
            meta: { external: true },
            data: { hint: 'x' },
        });
    });

    it('cannot be overridden out of the item type', () => {
        // `type` is written first and then spread over — but the spread cannot
        // reintroduce it, because `DefineIssueItemData` omits it. Pinning the
        // resulting value guards a reordering of the object literal.
        const item = defineIssueItem({
            path: [],
            message: 'x',
            code: 'custom',
        } as any);

        expect(item.type).toBe('item');
    });
});

describe('defineIssueGroup', () => {
    it('stamps the group discriminant', () => {
        expect(defineIssueGroup({
            path: [], 
            message: 'foo', 
            issues: [], 
        }).type).toBe('group');
    });

    it('carries children and the optional code through', () => {
        const child = defineIssueItem({
            path: ['a'], 
            message: 'x', 
            code: 'custom', 
        });
        const group = defineIssueGroup({
            path: [],
            message: 'foo',
            code: IssueCode.ONE_OF_FAILED,
            issues: [child],
        });

        expect(group.code).toBe(IssueCode.ONE_OF_FAILED);
        expect(group.issues[0]).toBe(child);
    });

    it('does not rewrite child paths', () => {
        // Documented division of labour: rebasing is `prefixIssuePath`'s job,
        // and doing it here too would double-prefix.
        const group = defineIssueGroup({
            path: ['user'],
            message: 'foo',
            issues: [defineIssueItem({
                path: ['street'], 
                message: 'x', 
                code: 'custom', 
            })],
        });

        expect(group.issues[0]!.path).toEqual(['street']);
    });
});

describe('defineIssueItem typed data contract', () => {
    // The producer-side gatekeep that catches mismatched payloads at compile
    // time. The value of these cases is in the `@ts-expect-error` directives,
    // which are INERT unless a `tsc` run covers the specs — `npm run
    // build:types` (the first half of `npm run build`) is what makes them
    // load-bearing. Verified non-vacuous by
    // collapsing `DefineIssueItemData`'s conditional to a permissive
    // `{ data?: any }`, which turns all three negative cases into
    // `TS2578: Unused '@ts-expect-error' directive`.

    it('accepts a parameterized code with its required data shape', () => {
        const item = defineIssueItem({
            path: ['count'],
            message: 'Too short',
            code: IssueCode.MIN_LENGTH,
            data: { min: 3 },
        });

        expect(item.code).toBe(IssueCode.MIN_LENGTH);
        // After narrowing on `code`, `data.min` is typed `number`.
        if (item.code === IssueCode.MIN_LENGTH) {
            expect(item.data.min).toBe(3);
        }
    });

    it('rejects a parameterized code with missing data', () => {
        // The missing-data error fires on the call as a whole (TS reports it
        // on the argument literal), not on the `code` line — so the directive
        // belongs immediately above the call.
        // @ts-expect-error — MIN_LENGTH requires data: { min: number }
        defineIssueItem({
            path: ['count'],
            message: 'Too short',
            code: IssueCode.MIN_LENGTH,
        });
    });

    it('rejects a parameterized code with the wrong data shape', () => {
        defineIssueItem({
            path: ['pwd'],
            message: 'Too weak',
            code: IssueCode.STRONG_PASSWORD,
            // @ts-expect-error — `pointsPerUnique` is a scoring weight, not a
            // documented strength-requirement key.
            data: { pointsPerUnique: 5 },
        });
    });

    it('accepts a bare code without data', () => {
        const item = defineIssueItem({
            path: ['email'],
            message: 'Not an email',
            code: IssueCode.EMAIL,
        });

        expect(item.code).toBe(IssueCode.EMAIL);
    });

    it('rejects a bare code with data', () => {
        defineIssueItem({
            path: ['email'],
            message: 'Not an email',
            code: IssueCode.EMAIL,
            // @ts-expect-error — EMAIL is a bare code; data must be absent.
            data: { irrelevant: 1 },
        });
    });

    it('accepts an ad-hoc string code with open data', () => {
        const item = defineIssueItem({
            path: ['email'],
            message: 'Email already in use',
            code: 'email_taken',
            data: { existingUserId: 'u_42' },
        });

        expect(item.code).toBe('email_taken');
    });

    it('accepts an ad-hoc string code without data', () => {
        const item = defineIssueItem({
            path: ['filter', 'name'],
            message: 'key not allowed',
            code: 'key_not_allowed',
        });

        expect(item.code).toBe('key_not_allowed');
    });
});

describe('defineIssueItem return type', () => {
    // `never` is assignable to everything, so a return type that collapses to
    // it breaks nothing at any call site and shows up in no runtime test —
    // it just quietly voids consumer-side narrowing. That is exactly what
    // `DefineIssueItemReturn` did before its `R` binding was hoisted into a
    // type parameter. These cases exist to make the collapse loud.
    //
    // `IsNever` is written as a tuple wrapper so it does not distribute over
    // a union return type; asserting `false` fails the typecheck the moment
    // any branch degenerates.

    type IsNever<T> = [T] extends [never] ? true : false;

    it('resolves a parameterized code to a concrete typed variant', () => {
        const item = defineIssueItem({
            path: [],
            message: 'x',
            code: IssueCode.MIN_LENGTH,
            data: { min: 1 },
        });

        // The annotations ARE the assertion — they pin the narrowed types,
        // not just that a property access compiles. Annotate the destructuring
        // PATTERN rather than writing `const min: number = item.data.min`:
        // `prefer-destructuring` is error-level in the shared config, so
        // `lint:fix` silently rewrites the latter into an unannotated
        // destructure and the assertion quietly degrades to "reading `.min`
        // compiles" (see testing.md).
        const notNever: IsNever<typeof item> = false;
        const { min }: { min: number } = item.data;
        const { code }: { code: 'min_length' } = item;

        expect([notNever, min, code]).toEqual([false, 1, 'min_length']);
    });

    it('resolves a bare code to a concrete bare variant', () => {
        const item = defineIssueItem({
            path: [],
            message: 'x',
            code: IssueCode.EMAIL,
        });

        const notNever: IsNever<typeof item> = false;
        const { code }: { code: 'email' } = item;

        expect([notNever, code]).toEqual([false, 'email']);
    });

    it('resolves an omitted code to the VALUE_INVALID bare variant', () => {
        const item = defineIssueItem({ path: [], message: 'x' });

        const notNever: IsNever<typeof item> = false;
        const { code }: { code: 'value_invalid' } = item;

        expect([notNever, code]).toEqual([false, 'value_invalid']);
    });

    it('resolves an ad-hoc code to the raw variant with open data', () => {
        const item = defineIssueItem({
            path: [],
            message: 'x',
            code: 'key_not_allowed',
            data: { anything: 1 },
        });

        const notNever: IsNever<typeof item> = false;
        const { data } = item;

        expect([notNever, data]).toEqual([false, { anything: 1 }]);
    });
});
