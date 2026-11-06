import type { DefineIssueItemData, DefineIssueItemReturn, IssueGroup  } from './types';
/*
 * Copyright (c) 2026.
 * Author Peter Placzek (tada5hi)
 * For the full copyright and license information,
 * view the LICENSE file that was distributed with this source code.
 */

import { IssueCode } from './constants';


/**
 * Build an `IssueItem`. TS uses the supplied `code` to pick the right
 * `data` requirement at the call site — passing `MIN_LENGTH` without
 * `data: { min }` is a compile error; passing `STRONG_PASSWORD` with
 * `data: { pointsPerUnique: 5 }` is a compile error.
 *
 * `code` may be omitted (defaults to `IssueCode.VALUE_INVALID` — bare,
 * no data).
 *
 * ```ts
 * defineIssueItem({
 *     code: IssueCode.MIN_LENGTH,
 *     path: ['name'],
 *     message: 'Must be at least 3 characters',
 *     data: { min: 3 },
 * });
 * ```
 */
export function defineIssueItem<C extends string | undefined = undefined>(
    data: DefineIssueItemData<C>,
): DefineIssueItemReturn<C> {
    return {
        type: 'item',
        ...data,
        code: (data as { code?: string }).code || IssueCode.VALUE_INVALID,
    } as unknown as DefineIssueItemReturn<C>;
}

/**
 * Build an {@link IssueGroup} — a node that carries child issues.
 *
 * The children's `path` values are used as given; this factory does not
 * rewrite them. When the children came from validating a *sub*-structure,
 * rebase them with {@link prefixIssuePath} first so the tree keeps its
 * absolute-path invariant.
 */
export function defineIssueGroup(data: Omit<IssueGroup, 'type'>): IssueGroup {
    return {
        type: 'group',
        ...data,
    };
}
