/*
 * Copyright (c) 2026.
 * Author Peter Placzek (tada5hi)
 * For the full copyright and license information,
 * view the LICENSE file that was distributed with this source code.
 */

import type {
    Issue,
    IssueBase,
    IssueGroup,
    IssueItem,
} from './types';

function isObject(input: unknown) : input is Record<string, any> {
    return !!input &&
        typeof input === 'object' &&
        !Array.isArray(input);
}

function isIssuePath(input: unknown) : input is PropertyKey[] {
    if (!Array.isArray(input)) {
        return false;
    }

    return input.every((el) => typeof el === 'string' ||
    typeof el === 'number' ||
    typeof el === 'symbol');
}

function isBaseIssue(input: unknown) : input is IssueBase & { [ke: string]: any } {
    if (!isObject(input)) {
        return false;
    }

    if (typeof input.message !== 'string') {
        return false;
    }

    if (!isIssuePath(input.path)) {
        return false;
    }

    return typeof input.meta === 'undefined' ||
        isObject(input.meta);
}

/**
 * Structural check for a leaf node.
 *
 * Deliberately duck-typed rather than `instanceof`-based: issues cross
 * package and realm boundaries, so a tree assembled from two libraries —
 * or from two copies of this package — must still validate.
 */
export function isIssueItem(input: unknown) : input is IssueItem {
    if (!isBaseIssue(input)) {
        return false;
    }

    if (input.type !== 'item') {
        return false;
    }

    return typeof input.code === 'string';
}

/**
 * Structural check for a node with children. Recurses, so a group only
 * passes when every descendant is itself well-formed.
 */
export function isIssueGroup(input: unknown) : input is IssueGroup {
    if (!isBaseIssue(input)) {
        return false;
    }

    if (input.type !== 'group') {
        return false;
    }

    return Array.isArray(input.issues) &&
        input.issues.every((issue) => isIssueItem(issue) || isIssueGroup(issue));
}

/**
 * Structural check for any node of the tree.
 */
export function isIssue(input: unknown) : input is Issue {
    return isIssueGroup(input) || isIssueItem(input);
}
