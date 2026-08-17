/*
 * Copyright (c) 2026.
 * Author Peter Placzek (tada5hi)
 * For the full copyright and license information,
 * view the LICENSE file that was distributed with this source code.
 */

import type {
    BareIssueCode,
    IssueCode,
    IssueDataByCode,
    ParameterizedIssueCode,
} from './constants';

/**
 * Resolve a possibly-`undefined` `code` to its effective vocabulary entry.
 * When a producer (e.g. {@link defineIssueItem}) is called without a `code`,
 * the runtime defaults to `IssueCode.VALUE_INVALID`; this helper reflects
 * that at the type level so the conditional-type signatures pick the
 * bare-data branch instead of the raw catch-all.
 *
 * `[C] extends [undefined]` is the standard idiom for testing the whole
 * `C` against `undefined` *without* distributing over union members.
 */
export type ResolveIssueCode<C> = [C] extends [undefined] ?
    typeof IssueCode.VALUE_INVALID :
    C & string;

export interface IssueBase {
    /**
     * Out-of-band provenance about how this issue came to exist — context the
     * consumer cannot reconstruct from `path` plus the producing library's
     * own configuration.
     *
     * The shape is a deliberately open `Record<string, unknown>`, because
     * issues cross library boundaries: the library that *produced* an issue
     * routinely knows things about it that the library *rendering* it does
     * not. Keys are owned by whoever writes them, and collisions are the
     * writers' problem to coordinate.
     *
     * The bar a library should hold itself to before claiming a key:
     * **provenance the consumer cannot reconstruct**. Two counter-examples
     * that look tempting and are not:
     *
     * - Presentation tokens (`severity`, `variant`, `color`). Those are a
     *   rendering decision, so they belong to the renderer, not the producer.
     * - Facts the caller already supplied (the active validation group, the
     *   requested locale). The caller can join those back on itself.
     *
     * Worked example — `validup` claims exactly two keys under this rule:
     * `optional: true` (the mount that produced this issue was declared
     * optional, which is invisible from `path` alone) and `external: true`
     * (the issue was injected from a server response rather than produced by
     * a local validator).
     */
    meta?: Record<string, unknown>,

    /**
     * Location of the issue within the validated structure, as discrete
     * segments — `['user', 'address', 'street']`, or `['items', 0, 'name']`
     * for an indexed element.
     *
     * **Paths are absolute, at every depth.** A node nested three groups deep
     * still carries its full path from the root of the validated structure,
     * not a path relative to its parent group. That invariant is what lets
     * a consumer call {@link flattenIssueItems} and index the result by field
     * without walking the tree to reassemble prefixes.
     *
     * The invariant is not automatic — it is maintained by the *producer*.
     * A library that validates a sub-structure and merges the resulting
     * issues into a parent tree must rewrite the children as it merges;
     * {@link prefixIssuePath} is that step, and it is exported here precisely
     * so every producer performs it identically.
     */
    path: PropertyKey[],

    /**
     * Default-rendered message (eager, English). Use {@link formatIssue} with
     * a `code → template` map for localized re-rendering at the consumer side.
     */
    message: string,

    /**
     * Structured parameters used by the default `message` rendering and
     * available to consumer-side formatters (i18n, custom locales). The
     * concrete shape depends on the discriminating `code` — see the
     * `IssueItem` union below for the per-code contract.
     */
    data?: Record<string, unknown>
}

/**
 * Shared shape for every `IssueItem` branch — the discriminant (`type:
 * 'item'`) plus the vendor-passthrough fields. The `code` and `data`
 * fields are intentionally absent here; each branch in the discriminated
 * union below pins them to the right pair.
 */
interface IssueItemCommon extends IssueBase {
    /**
     * Issue Type
     */
    type: 'item',

    /**
     * Received input value.
     */
    received?: unknown,

    /**
     * Expected input value.
     */
    expected?: unknown,
}

/**
 * Typed-data branch — one variant per `ParameterizedIssueCode`. The
 * `data` shape is locked to the documented contract via
 * {@link IssueDataByCode}.
 *
 * Distributed (rather than written as a single `code: ParameterizedIssueCode`
 * member) so that `Extract<IssueItem, { code: 'min_length' }>` and structural
 * narrowing on `issue.code === IssueCode.MIN_LENGTH` resolve to the right
 * concrete variant with `data: { min: number }`, not the joined union.
 */
export type IssueItemTyped = {
    [K in ParameterizedIssueCode]: IssueItemCommon & {
        code: K,
        data: IssueDataByCode[K],
    };
}[ParameterizedIssueCode];

/**
 * Bare-data branch — one variant per `BareIssueCode`. `data` must be
 * absent (or explicitly `undefined`).
 *
 * Distributed for the same reason as {@link IssueItemTyped} — so
 * `Extract<IssueItem, { code: 'email' }>` resolves to the single
 * `code: 'email'` variant.
 */
export type IssueItemBare = {
    [K in BareIssueCode]: IssueItemCommon & {
        code: K,
        data?: undefined,
    };
}[BareIssueCode];

/**
 * Escape-hatch branch — ad-hoc / project-specific codes outside the
 * shipped vocabulary. `code: string & {}` keeps autocomplete on the
 * `IssueCode` literals while permitting strings the typed branches don't
 * cover; `data` is fully open.
 *
 * This is the branch a library with its own vocabulary lands on. `rapiq`
 * emitting `key_not_allowed` needs no coordination with this package —
 * it is a well-formed `IssueItem` on sight. Augment
 * {@link IssueDataByCode} if you additionally want the typed `data`
 * gatekeep for your own codes.
 *
 * Note: because `string & {}` accepts any string at the type level,
 * narrowing on `issue.code === IssueCode.MIN_LENGTH` still pulls this
 * branch in alongside the matching `IssueItemTyped` variant. The
 * producer-side {@link defineIssueItem} signature gatekeeps this so
 * emission is always correct; consumers needing a clean narrow should use
 * `Extract<IssueItem, { code: 'min_length' }>` or cast `issue.data` after
 * the code check.
 */
export interface IssueItemRaw extends IssueItemCommon {
    code: string & {},
    data?: Record<string, unknown>,
}

/**
 * Discriminated union over `IssueItem`'s three branches:
 *
 * - {@link IssueItemTyped} — known parameterized codes (`MIN_LENGTH`,
 *   `PATTERN`, `STRONG_PASSWORD`, …); `data` is required and typed.
 * - {@link IssueItemBare} — known param-less codes (`EMAIL`, `REQUIRED`,
 *   …); `data` must be absent.
 * - {@link IssueItemRaw} — ad-hoc string codes; `data` is open.
 *
 * The discriminant is `code`. Build issues with {@link defineIssueItem}
 * (its conditional-type signature enforces the per-branch contract) rather
 * than constructing literals by hand.
 */
export type IssueItem = IssueItemTyped | IssueItemBare | IssueItemRaw;

/**
 * A node with children — the recursive half of the tree.
 *
 * Groups exist to preserve *why* a set of issues belongs together when a
 * flat list would lose it: the branches of a failed `oneOf`, the issues
 * raised by one nested sub-structure, one element of a collection. A
 * consumer that does not care can call {@link flattenIssueItems} and
 * ignore grouping entirely; one that does can walk the tree.
 */
export interface IssueGroup extends IssueBase {
    /**
     * Code identifying the issue. See `IssueItem.code` for the
     * vocabulary + ad-hoc widening conventions.
     */
    code?: IssueCode | (string & {}),

    /**
     * Issue Type
     */
    type: 'group',

    /**
     * Child issues.
     *
     * Every descendant carries an **absolute** `path`, not one relative to
     * this group — see {@link IssueBase.path}.
     */
    issues: Issue[]
}

export type Issue = IssueGroup | IssueItem;
