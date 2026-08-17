/*
 * Copyright (c) 2026.
 * Author Peter Placzek (tada5hi)
 * For the full copyright and license information,
 * view the LICENSE file that was distributed with this source code.
 */

import { describe, expect, it } from 'vitest';
import {
    IssueCode,
    defineIssueGroup,
    defineIssueItem,
    formatIssue,
    interpolate,
} from '../../../src';

describe('interpolate', () => {
    // This implementation replaces `@ebec/core`'s so the package can stay
    // dependency-free. `validup` re-exports it under the same name, so every
    // property below is behavioural parity with what it replaced, not a
    // fresh design — changing any of them is a break for those consumers.

    it('substitutes a placeholder from data', () => {
        expect(interpolate('hello {who}', { who: 'world' })).toBe('hello world');
    });

    it('substitutes several distinct placeholders', () => {
        expect(interpolate('{a} then {b}', { a: '1', b: '2' })).toBe('1 then 2');
    });

    it('leaves a placeholder verbatim when the key is absent from data', () => {
        // Degrade to a readable template rather than to "undefined".
        expect(interpolate('hello {who}', {})).toBe('hello {who}');
    });

    it('leaves a placeholder verbatim when the value is explicitly undefined', () => {
        expect(interpolate('hello {who}', { who: undefined })).toBe('hello {who}');
    });

    it('substitutes a value present but falsy', () => {
        // `typeof !== 'undefined'` is the gate, not truthiness — 0 and '' are
        // legitimate values for codes like MIN_LENGTH.
        expect(interpolate('at least {min}', { min: 0 })).toBe('at least 0');
        expect(interpolate('got {v}', { v: '' })).toBe('got ');
        expect(interpolate('got {v}', { v: false })).toBe('got false');
        expect(interpolate('got {v}', { v: null })).toBe('got null');
    });

    it('coerces non-string values with String()', () => {
        expect(interpolate('{n} and {b}', { n: 42, b: true })).toBe('42 and true');
    });

    it('replaces every occurrence of a repeated placeholder', () => {
        expect(interpolate('{a}-{a}', { a: 'x' })).toBe('x-x');
    });

    it('returns the input unchanged when it holds no placeholders', () => {
        expect(interpolate('nothing here', { a: 'x' })).toBe('nothing here');
    });

    it('accepts a custom regex whose first group is the key', () => {
        expect(interpolate('hello %who%', { who: 'world' }, /%(\w+)%/g)).toBe('hello world');
    });

    it('ignores placeholder-looking text the default regex does not match', () => {
        // The default pattern is `\w+` — a dotted or spaced key is not a
        // placeholder, so nested-path templates are not supported.
        expect(interpolate('{a.b}', { 'a.b': 'x' })).toBe('{a.b}');
    });

    it('interprets $-patterns inside a substituted VALUE', () => {
        // Inherited quirk, pinned deliberately: substitution goes through
        // `String.prototype.replace` with a string replacement, so `$&` in a
        // DATA value is expanded as a replacement pattern rather than kept
        // literal. Callers must treat `data` as trusted or escape `$`.
        // Asserting it means "fixing" it has to be a deliberate, versioned
        // decision rather than a silent behaviour change for re-exporters.
        expect(interpolate('x {v}', { v: '$&' })).toBe('x {v}');
    });
});

describe('formatIssue', () => {
    it('falls back to issue.message when no templates are provided', () => {
        const issue = defineIssueItem({ path: ['x'], message: 'invalid' });

        expect(formatIssue(issue)).toBe('invalid');
    });

    it('interpolates a matching template using data', () => {
        const issue = defineIssueItem({
            code: IssueCode.MIN_LENGTH,
            path: ['name'],
            message: 'Must be at least 3 characters',
            data: { min: 3 },
        });

        expect(formatIssue(issue, { min_length: 'Mindestens {min} Zeichen' }))
            .toBe('Mindestens 3 Zeichen');
    });

    it('prefers the template over the eager message', () => {
        const issue = defineIssueItem({
            code: 'custom',
            path: [],
            message: 'english',
            data: {},
        });

        expect(formatIssue(issue, { custom: 'translated' })).toBe('translated');
    });

    it('falls back per-code, not all-or-nothing', () => {
        // A partial catalog is the normal case; a code it does not cover must
        // still render via the eager message.
        const templates = { min_length: 'Mindestens {min} Zeichen' };
        const uncovered = defineIssueItem({
            code: IssueCode.EMAIL,
            path: ['email'],
            message: 'Not an email',
        });

        expect(formatIssue(uncovered, templates)).toBe('Not an email');
    });

    it('tolerates a template with placeholders when the issue carries no data', () => {
        // `issue.data || {}` — a bare code paired with a parameterized
        // template leaves the placeholder in place instead of throwing.
        const issue = defineIssueItem({
            code: IssueCode.EMAIL,
            path: ['email'],
            message: 'Not an email',
        });

        expect(formatIssue(issue, { email: 'need {min}' })).toBe('need {min}');
    });

    it('ignores a non-string template entry', () => {
        const issue = defineIssueItem({
            code: 'custom', 
            path: [], 
            message: 'literal', 
        });

        expect(formatIssue(issue, { custom: 42 as unknown as string })).toBe('literal');
    });

    it('formats a group via its optional code', () => {
        const group = defineIssueGroup({
            code: IssueCode.ONE_OF_FAILED,
            path: ['x'],
            message: 'none matched',
            issues: [],
        });

        expect(formatIssue(group, { one_of_failed: 'Keine Variante passte' }))
            .toBe('Keine Variante passte');
    });

    it('skips template lookup for a group with no code', () => {
        const group = defineIssueGroup({
            path: ['x'], 
            message: 'literal', 
            issues: [], 
        });

        expect(formatIssue(group, { one_of_failed: 'nope' })).toBe('literal');
    });

    it('returns the fallback when neither template nor message resolves', () => {
        const issue = defineIssueGroup({
            path: [], 
            message: '', 
            issues: [], 
        });

        expect(formatIssue(issue, undefined, '—')).toBe('—');
    });

    it('returns an empty string as the default fallback', () => {
        const issue = defineIssueGroup({
            path: [], 
            message: '', 
            issues: [], 
        });

        expect(formatIssue(issue)).toBe('');
    });
});
