/*
 * Copyright (c) 2026.
 * Author Peter Placzek (tada5hi)
 * For the full copyright and license information,
 * view the LICENSE file that was distributed with this source code.
 */

import { IssueCode } from './constants';
import type {
    BareIssueCode,
    IssueDataByCode,
    ParameterizedIssueCode,
} from './constants';
import type {
    IssueBase,
    IssueGroup,
    IssueItemBare,
    IssueItemRaw,
    IssueItemTyped,
    ResolveIssueCode,
} from './types';

interface DefineIssueItemCommon extends Omit<IssueBase, 'data'> {
    received?: unknown,
    expected?: unknown,
}

/**
 * Per-call `data` shape for {@link defineIssueItem}. The `data`
 * requirement is selected from the resolved `code`:
 *
 * - Parameterized code → `data` required, typed per {@link IssueDataByCode}.
 * - Bare code (incl. omitted, which resolves to `VALUE_INVALID`)
 *   → `data` must be absent / `undefined`.
 * - Ad-hoc string code → `data` optional `Record`.
 */
export type DefineIssueItemData<C> = DefineIssueItemCommon & {
    code?: C,
} & (
    ResolveIssueCode<C> extends ParameterizedIssueCode ?
        { data: IssueDataByCode[ResolveIssueCode<C> & ParameterizedIssueCode] } :
        ResolveIssueCode<C> extends BareIssueCode ?
            { data?: undefined } :
            { data?: Record<string, unknown> }
);

/**
 * Return type for {@link defineIssueItem} — picks the concrete `IssueItem`
 * variant matching the resolved `code`.
 *
 * `R` is an internal binding, not an argument: the resolved code has to be
 * computed **once** into a type parameter rather than re-spelled as
 * `ResolveIssueCode<C>` at each use. Writing it inline collapses the whole
 * alias to `never` — `Extract` distributes over `IssueItemTyped`'s union
 * and, with the target still expressed in terms of the alias's own type
 * parameter, no member is provably assignable, so every branch yields
 * `never`. The branch *selection* keeps working, which is what makes the
 * bug quiet: `defineIssueItem` still rejects a bad payload, it just hands
 * back `never`, and `never` is assignable to everything — so no call site
 * complains and consumer-side narrowing silently stops meaning anything.
 * Pinned by the type-level cases in `test/unit/issue/define.spec.ts`, which
 * are only load-bearing because `npm run typecheck` covers the specs.
 */
export type DefineIssueItemReturn<C, R = ResolveIssueCode<C>> = R extends ParameterizedIssueCode ?
    Extract<IssueItemTyped, { code: R }> :
    R extends BareIssueCode ?
        Extract<IssueItemBare, { code: R }> :
        IssueItemRaw;

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
