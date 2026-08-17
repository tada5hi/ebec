/*
 * Copyright (c) 2026.
 * Author Peter Placzek (tada5hi)
 * For the full copyright and license information,
 * view the LICENSE file that was distributed with this source code.
 */

import { describe, expect, it } from 'vitest';
import type { Issue, IssueGroup } from '../../../src';
import {
    defineIssueGroup,
    defineIssueItem,
    flattenIssueItems,
    prefixIssuePath,
} from '../../../src';

const item = (path: PropertyKey[], message = 'invalid') => defineIssueItem({
    path,
    message,
    code: 'value_invalid',
});

describe('prefixIssuePath', () => {
    it('prepends the prefix to a leaf path', () => {
        const output = prefixIssuePath(item(['street']), ['address']);

        expect(output.path).toEqual(['address', 'street']);
    });

    it('prepends a multi-segment prefix in order', () => {
        const output = prefixIssuePath(item(['street']), ['user', 'address']);

        expect(output.path).toEqual(['user', 'address', 'street']);
    });

    it('preserves numeric and symbol segments', () => {
        // `path` is `PropertyKey[]`, not `string[]` — indexed elements arrive
        // as numbers and must not be stringified in transit.
        const symbol = Symbol('s');
        const output = prefixIssuePath(item([0, symbol]), ['items']);

        expect(output.path).toEqual(['items', 0, symbol]);
    });

    it('rebases a group and its direct children', () => {
        const group = defineIssueGroup({
            path: ['address'],
            message: 'address is invalid',
            issues: [item(['address', 'street']), item(['address', 'zip'])],
        });

        const output = prefixIssuePath(group, ['user']) as IssueGroup;

        expect(output.path).toEqual(['user', 'address']);
        expect(output.issues.map((issue) => issue.path)).toEqual([
            ['user', 'address', 'street'],
            ['user', 'address', 'zip'],
        ]);
    });

    it('rebases every leaf of a deeply nested tree, not just the top level', () => {
        // THE load-bearing case. An implementation that prefixes only the node
        // it was handed passes every single-level test above; it fails here.
        // That is the bug this function exists to prevent, and the reason it
        // is exported rather than left for each producer to rewrite.
        const tree: Issue = defineIssueGroup({
            path: ['a'],
            message: 'a',
            issues: [
                defineIssueGroup({
                    path: ['a', 'b'],
                    message: 'b',
                    issues: [
                        defineIssueGroup({
                            path: ['a', 'b', 'c'],
                            message: 'c',
                            issues: [item(['a', 'b', 'c', 'leaf'])],
                        }),
                    ],
                }),
            ],
        });

        const output = prefixIssuePath(tree, ['root']);

        expect(flattenIssueItems([output]).map((leaf) => leaf.path)).toEqual([
            ['root', 'a', 'b', 'c', 'leaf'],
        ]);
    });

    it('applies the same prefix at every depth, not a cumulative one', () => {
        // Guards the other direction: recursing with `prefixed.path` instead of
        // `prefix` would compound the prefix as it descends.
        const group = defineIssueGroup({
            path: ['a'],
            message: 'a',
            issues: [
                defineIssueGroup({
                    path: ['a', 'b'],
                    message: 'b',
                    issues: [item(['a', 'b', 'leaf'])],
                }),
            ],
        });

        const output = prefixIssuePath(group, ['x']) as IssueGroup;
        const inner = output.issues[0] as IssueGroup;

        expect(output.path).toEqual(['x', 'a']);
        expect(inner.path).toEqual(['x', 'a', 'b']);
        expect(inner.issues[0]!.path).toEqual(['x', 'a', 'b', 'leaf']);
    });

    it('does not mutate the input tree', () => {
        const leaf = item(['a', 'b', 'leaf']);
        const inner = defineIssueGroup({
            path: ['a', 'b'], 
            message: 'b', 
            issues: [leaf], 
        });
        const outer = defineIssueGroup({
            path: ['a'], 
            message: 'a', 
            issues: [inner], 
        });

        prefixIssuePath(outer, ['root']);

        expect(outer.path).toEqual(['a']);
        expect(inner.path).toEqual(['a', 'b']);
        expect(leaf.path).toEqual(['a', 'b', 'leaf']);
    });

    it('returns fresh objects for the whole spine, including leaves', () => {
        const leaf = item(['a', 'leaf']);
        const group = defineIssueGroup({
            path: ['a'], 
            message: 'a', 
            issues: [leaf], 
        });

        const output = prefixIssuePath(group, ['root']) as IssueGroup;

        expect(output).not.toBe(group);
        expect(output.issues).not.toBe(group.issues);
        expect(output.issues[0]).not.toBe(leaf);
    });

    it('copies unconditionally, even for an empty prefix', () => {
        // Documented: there is no identity fast-path. A caller may rely on
        // always getting a detached object back.
        const input = item(['a']);
        const output = prefixIssuePath(input, []);

        expect(output).not.toBe(input);
        expect(output.path).toEqual(['a']);
    });

    it('carries data and meta over by reference', () => {
        // The copy is SHALLOW — pinned because it is the aliasing hazard a
        // caller has to know about before mutating `meta` on a result.
        const data = { min: 3 };
        const meta = { optional: true } as const;
        const input = defineIssueItem({
            path: ['a'],
            message: 'too short',
            code: 'min_length',
            data,
            meta,
        });

        const output = prefixIssuePath(input, ['root']);

        expect(output.data).toBe(data);
        expect(output.meta).toBe(meta);
    });

    it('preserves every non-path field', () => {
        const input = defineIssueItem({
            path: ['a'],
            message: 'too short',
            code: 'min_length',
            data: { min: 3 },
            received: 'ab',
            expected: 'abc',
        });

        const output = prefixIssuePath(input, ['root']);

        expect(output).toEqual({
            type: 'item',
            code: 'min_length',
            message: 'too short',
            data: { min: 3 },
            received: 'ab',
            expected: 'abc',
            path: ['root', 'a'],
        });
    });

    it('tolerates a malformed issue carrying no path', () => {
        // Defensive `issue.path || []`. Issues cross library boundaries, so
        // the input is not always something this package produced.
        const output = prefixIssuePath({
            type: 'item',
            code: 'value_invalid',
            message: 'invalid',
        } as unknown as Issue, ['root']);

        expect(output.path).toEqual(['root']);
    });

    it('handles a group with no children', () => {
        const output = prefixIssuePath(
            defineIssueGroup({
                path: ['a'], 
                message: 'a', 
                issues: [], 
            }),
            ['root'],
        ) as IssueGroup;

        expect(output.path).toEqual(['root', 'a']);
        expect(output.issues).toEqual([]);
    });
});
