/*
 * Copyright (c) 2026.
 *  Author Peter Placzek (tada5hi)
 *  For the full copyright and license information,
 *  view the LICENSE file that was distributed with this source code.
 */

export * from './types';
export * from './module';
export * from './options';
export * from './helpers';
export * from './catalog';
export type {
    ErrorCatalogEntry,
    ErrorCatalogDefinitions,
    ErrorFactory,
    ErrorCatalog,
} from './types';
export {
    IssueCode,
    defineIssueGroup,
    defineIssueItem,
    flattenIssueGroups,
    flattenIssueItems,
    formatIssue,
    isIssue,
    isIssueGroup,
    isIssueItem,
    prefixIssuePath,
} from './issue';
export type {
    BareIssueCode,
    DefineIssueItemData,
    DefineIssueItemReturn,
    Issue,
    IssueBase,
    IssueDataByCode,
    IssueGroup,
    IssueItem,
    IssueItemBare,
    IssueItemRaw,
    IssueItemTyped,
    IssueMessageTemplates,
    ParameterizedIssueCode,
    ResolveIssueCode,
} from './issue';
