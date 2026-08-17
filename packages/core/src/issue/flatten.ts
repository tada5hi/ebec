/*
 * Copyright (c) 2026.
 * Author Peter Placzek (tada5hi)
 * For the full copyright and license information,
 * view the LICENSE file that was distributed with this source code.
 */

import { isIssueGroup, isIssueItem } from './check';
import type { Issue, IssueGroup, IssueItem } from './types';

/**
 * Collect every leaf of the tree, in pre-order, discarding grouping.
 *
 * This is the workhorse for consumers that render per-field errors: since
 * every node carries an absolute `path` (see `IssueBase.path`), the result
 * can be indexed by field directly, with no tree walk to reassemble
 * prefixes.
 *
 * Returned items are the **same object references** held by the tree, not
 * copies — cheap to call, but do not mutate what you get back.
 */
export function flattenIssueItems(issues: readonly Issue[]): IssueItem[] {
    const output: IssueItem[] = [];
    for (const issue of issues) {
        if (isIssueItem(issue)) {
            output.push(issue);
        } else {
            output.push(...flattenIssueItems(issue.issues));
        }
    }
    return output;
}

/**
 * Collect every group of the tree, in pre-order, including nested groups.
 *
 * A group is emitted before its own descendants are visited, so the result
 * reads outermost-first. As with {@link flattenIssueItems}, entries are
 * live references into the tree.
 */
export function flattenIssueGroups(issues: readonly Issue[]): IssueGroup[] {
    const output: IssueGroup[] = [];
    for (const issue of issues) {
        if (isIssueGroup(issue)) {
            output.push(issue);
            output.push(...flattenIssueGroups(issue.issues));
        }
    }
    return output;
}
