/*
 * Copyright (c) 2026.
 * Author Peter Placzek (tada5hi)
 * For the full copyright and license information,
 * view the LICENSE file that was distributed with this source code.
 */

import { describe, expect, it } from 'vitest';
import type { IssueGroup, IssueItem } from '../../../src';
import {
    defineIssueGroup,
    defineIssueItem,
    isIssue,
    isIssueGroup,
    isIssueItem,
} from '../../../src';

describe('isIssueItem', () => {
    it('verifies an issue item', () => {
        const input : IssueItem = defineIssueItem({
            path: [],
            message: 'foo',
            code: 'bar',
        });

        expect(isIssueItem(input)).toBe(true);
    });

    it('rejects a shape missing type', () => {
        const input : Partial<IssueItem> = {
            path: [],
            message: 'foo',
            code: 'bar',
        };

        expect(isIssueItem(input)).toBe(false);
    });

    it('rejects a shape missing path', () => {
        const input : Partial<IssueItem> = {
            type: 'item',
            message: 'foo',
            code: 'bar',
        };

        expect(isIssueItem(input)).toBe(false);
    });

    it('rejects a shape missing message', () => {
        const input : Partial<IssueItem> = {
            type: 'item',
            path: [],
            code: 'bar',
        };

        expect(isIssueItem(input)).toBe(false);
    });

    it('rejects a shape missing code', () => {
        const input : Partial<IssueItem> = {
            type: 'item',
            path: [],
            message: 'foo',
        };

        expect(isIssueItem(input)).toBe(false);
    });

    it('accepts an item produced by another library', () => {
        // The guard is duck-typed on purpose: a tree assembled across package
        // or realm boundaries has no shared class to instanceof against.
        expect(isIssueItem({
            type: 'item',
            path: ['filter', 'name'],
            message: 'key not allowed',
            code: 'key_not_allowed',
        })).toBe(true);
    });
});

describe('isIssueGroup', () => {
    it('verifies a group with nested groups and items', () => {
        const input = defineIssueGroup({
            path: [],
            message: 'foo',
            issues: [
                defineIssueGroup({
                    path: [],
                    message: 'bar',
                    issues: [
                        defineIssueItem({
                            code: 'foo', 
                            message: 'bar', 
                            path: [], 
                        }),
                    ],
                }),
                defineIssueItem({
                    code: 'baz', 
                    message: 'boz', 
                    path: [], 
                }),
            ],
        });

        expect(isIssueGroup(input)).toBe(true);
    });

    it('rejects a shape missing type', () => {
        const input : Partial<IssueGroup> = {
            path: [],
            message: 'foo',
            code: 'bar',
            issues: [],
        };

        expect(isIssueGroup(input)).toBe(false);
    });

    it('rejects a shape missing issues', () => {
        const input : Partial<IssueGroup> = {
            type: 'group',
            path: [],
            message: 'foo',
            code: 'bar',
        };

        expect(isIssueGroup(input)).toBe(false);
    });

    it('rejects a shape missing the base fields', () => {
        // Hits the `isBaseIssue` rejection inside `isIssueGroup` — the shape
        // carries the discriminant and the issues array but not the base
        // fields every issue must have.
        expect(isIssueGroup({ type: 'group', issues: [] })).toBe(false);
    });

    it('rejects a group whose nested member is not an issue', () => {
        const input : Partial<IssueGroup> = {
            type: 'group',
            path: [],
            message: 'foo',
            issues: [{ nope: true } as any],
        };

        expect(isIssueGroup(input)).toBe(false);
    });

    it('rejects a group whose malformed member is nested several levels deep', () => {
        // The recursion is the point — a check that only validated direct
        // children would pass this.
        expect(isIssueGroup({
            type: 'group',
            path: [],
            message: 'outer',
            issues: [{
                type: 'group',
                path: [],
                message: 'inner',
                issues: [{ nope: true }],
            }],
        })).toBe(false);
    });
});

describe('isIssue', () => {
    // Union guard — `isIssueGroup(input) || isIssueItem(input)`. Both arms
    // plus the shared `isBaseIssue` rejection are covered here.

    it('verifies an issue item', () => {
        expect(isIssue(defineIssueItem({
            path: [],
            message: 'foo',
            code: 'bar',
        }))).toBe(true);
    });

    it('verifies an issue group', () => {
        expect(isIssue(defineIssueGroup({
            path: [],
            message: 'foo',
            issues: [
                defineIssueItem({
                    path: [], 
                    message: 'bar', 
                    code: 'baz', 
                }),
            ],
        }))).toBe(true);
    });

    it('verifies a group nested in a group', () => {
        expect(isIssue(defineIssueGroup({
            path: ['a'],
            message: 'outer',
            issues: [
                defineIssueGroup({
                    path: ['a', 'b'], 
                    message: 'inner', 
                    issues: [], 
                }),
            ],
        }))).toBe(true);
    });

    it('rejects a shape matching neither arm', () => {
        expect(isIssue({
            type: 'item', 
            path: [], 
            message: 'foo', 
        })).toBe(false);
        expect(isIssue({
            type: 'group', 
            path: [], 
            message: 'foo', 
        })).toBe(false);
        expect(isIssue({
            type: 'other', 
            path: [], 
            message: 'foo', 
            code: 'bar',
        })).toBe(false);
    });

    it('rejects non-objects', () => {
        expect(isIssue(null)).toBe(false);
        expect(isIssue(undefined)).toBe(false);
        expect(isIssue('issue')).toBe(false);
        expect(isIssue(42)).toBe(false);
        expect(isIssue([])).toBe(false);
    });

    it('rejects an issue whose path holds non-PropertyKey members', () => {
        expect(isIssue({
            type: 'item',
            path: [{ nope: true }],
            message: 'foo',
            code: 'bar',
        })).toBe(false);
    });

    it('accepts numeric and symbol path segments', () => {
        expect(isIssue({
            type: 'item',
            path: ['items', 0, Symbol('s')],
            message: 'foo',
            code: 'bar',
        })).toBe(true);
    });

    it('rejects an issue whose meta is not an object', () => {
        expect(isIssue({
            type: 'item',
            path: [],
            message: 'foo',
            code: 'bar',
            meta: 'nope',
        })).toBe(false);
    });

    it('accepts an issue with an absent meta', () => {
        expect(isIssue({
            type: 'item',
            path: [],
            message: 'foo',
            code: 'bar',
            meta: undefined,
        })).toBe(true);
    });
});
