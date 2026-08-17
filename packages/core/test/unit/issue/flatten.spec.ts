/*
 * Copyright (c) 2026.
 * Author Peter Placzek (tada5hi)
 * For the full copyright and license information,
 * view the LICENSE file that was distributed with this source code.
 */

import { describe, expect, it } from 'vitest';
import {
    defineIssueGroup,
    defineIssueItem,
    flattenIssueGroups,
    flattenIssueItems,
} from '../../../src';

const item = (name: string) => defineIssueItem({
    path: [name],
    message: `${name} is invalid`,
    code: 'value_invalid',
});

describe('flattenIssueGroups', () => {
    it('returns an empty list for empty input', () => {
        expect(flattenIssueGroups([])).toEqual([]);
    });

    it('returns an empty list when the tree holds items only', () => {
        // The item branch contributes nothing AND is never recursed into —
        // the deliberate asymmetry vs. `flattenIssueItems`, which recurses on
        // its else branch.
        expect(flattenIssueGroups([item('a'), item('b')])).toEqual([]);
    });

    it('collects a group whose children are all items', () => {
        const group = defineIssueGroup({
            path: ['user'],
            message: 'user is invalid',
            issues: [item('name'), item('email')],
        });

        const output = flattenIssueGroups([group]);

        expect(output).toHaveLength(1);
        expect(output[0]).toBe(group);
    });

    it('collects nested groups in pre-order (parent before descendants)', () => {
        // The ordering guarantee is CHOSEN, not inherited: `output.push(issue)`
        // runs before the recursive spread, so a consumer walking the result
        // always sees an ancestor before its descendants. Changing that would
        // be a behavioural change, not a refactor.
        const innermost = defineIssueGroup({
            path: ['a', 'b', 'c'],
            message: 'innermost',
            issues: [item('leaf')],
        });
        const middle = defineIssueGroup({
            path: ['a', 'b'],
            message: 'middle',
            issues: [innermost],
        });
        const outermost = defineIssueGroup({
            path: ['a'],
            message: 'outermost',
            issues: [middle],
        });

        const output = flattenIssueGroups([outermost]);

        expect(output).toHaveLength(3);
        expect(output[0]).toBe(outermost);
        expect(output[1]).toBe(middle);
        expect(output[2]).toBe(innermost);
    });

    it('skips items mixed alongside groups at any level', () => {
        const inner = defineIssueGroup({
            path: ['a', 'b'],
            message: 'inner',
            issues: [item('leaf')],
        });
        const outer = defineIssueGroup({
            path: ['a'],
            message: 'outer',
            issues: [item('sibling'), inner],
        });

        const output = flattenIssueGroups([item('top'), outer]);

        expect(output).toEqual([outer, inner]);
    });

    it('returns the original group references (no cloning)', () => {
        // Consumers may key caches / maps off identity — assert it explicitly
        // so a future "defensive copy" refactor has to be a deliberate choice.
        const group = defineIssueGroup({
            path: [],
            message: 'group',
            issues: [],
        });

        expect(flattenIssueGroups([group])[0]).toBe(group);
    });
});

describe('flattenIssueItems', () => {
    it('returns an empty list for empty input', () => {
        expect(flattenIssueItems([])).toEqual([]);
    });

    it('returns an empty list for a group with no leaves', () => {
        expect(flattenIssueItems([
            defineIssueGroup({
                path: ['a'], 
                message: 'a', 
                issues: [], 
            }),
        ])).toEqual([]);
    });

    it('descends through groups and returns leaves only, in pre-order', () => {
        const leafA = item('a');
        const leafB = item('b');
        const leafC = item('c');

        const output = flattenIssueItems([
            leafA,
            defineIssueGroup({
                path: ['g'],
                message: 'g',
                issues: [
                    leafB,
                    defineIssueGroup({
                        path: ['g', 'h'],
                        message: 'h',
                        issues: [leafC],
                    }),
                ],
            }),
        ]);

        expect(output).toEqual([leafA, leafB, leafC]);
        expect(output[0]).toBe(leafA);
    });

    it('returns the original item references (no cloning)', () => {
        const leaf = item('a');

        expect(flattenIssueItems([
            defineIssueGroup({
                path: ['g'], 
                message: 'g', 
                issues: [leaf], 
            }),
        ])[0]).toBe(leaf);
    });

    it('indexes cleanly by path because every leaf carries an absolute one', () => {
        // The payoff of the absolute-path invariant: no tree walk is needed to
        // reassemble a leaf's location, so per-field lookup is a one-liner.
        const tree = defineIssueGroup({
            path: ['user'],
            message: 'user is invalid',
            issues: [
                defineIssueItem({
                    path: ['user', 'name'], 
                    message: 'required', 
                    code: 'required', 
                }),
                defineIssueGroup({
                    path: ['user', 'address'],
                    message: 'address is invalid',
                    issues: [
                        defineIssueItem({
                            path: ['user', 'address', 'zip'],
                            message: 'required',
                            code: 'required',
                        }),
                    ],
                }),
            ],
        });

        const byField = Object.fromEntries(
            flattenIssueItems([tree]).map((leaf) => [leaf.path.join('.'), leaf.message]),
        );

        expect(byField).toEqual({
            'user.name': 'required',
            'user.address.zip': 'required',
        });
    });
});
