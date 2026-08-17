/*
 * Copyright (c) 2026.
 * Author Peter Placzek (tada5hi)
 * For the full copyright and license information,
 * view the LICENSE file that was distributed with this source code.
 */

import type { Issue } from './types';

/**
 * Rebase an issue onto a parent path, recursing into groups so every
 * descendant is rebased too.
 *
 * This is the step that maintains the absolute-path invariant (see
 * `IssueBase.path`). Whenever a producer validates a *sub*-structure and
 * merges the resulting issues into a larger tree, the children arrive with
 * paths relative to that sub-structure and have to be rewritten. Doing it
 * only at the top level is the tempting bug: a child that already wrapped
 * its own failures in an {@link IssueGroup} would surface inner leaves
 * missing the parent segment, and every consumer relying on
 * {@link flattenIssueItems} for per-field lookup would silently mis-index
 * exactly the nested cases.
 *
 * ```ts
 * // validating `address` produced issues at ['street']
 * const rebased = issues.map((issue) => prefixIssuePath(issue, ['address']));
 * // → paths are now ['address', 'street'], at every depth
 * ```
 *
 * **Returns copies.** The input is never mutated: each visited node is
 * shallow-copied and a group's `issues` array is rebuilt from the rebased
 * children, so the whole spine is fresh. `data` and `meta` are carried over
 * by reference — cheap, but it means a caller that mutates `meta` on the
 * result also mutates it on the original. Copying happens unconditionally,
 * including for an empty `prefix`.
 */
export function prefixIssuePath(issue: Issue, prefix: PropertyKey[]): Issue {
    const prefixed: Issue = {
        ...issue,
        path: [...prefix, ...(issue.path || [])],
    };

    if (prefixed.type === 'group') {
        prefixed.issues = prefixed.issues.map(
            (nested) => prefixIssuePath(nested, prefix),
        );
    }

    return prefixed;
}
