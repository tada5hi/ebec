import type { Issue, IssueMessageTemplates  } from './types';
/*
 * Copyright (c) 2026.
 * Author Peter Placzek (tada5hi)
 * For the full copyright and license information,
 * view the LICENSE file that was distributed with this source code.
 */

import { interpolate } from '../helpers/interpolate';


/**
 * Render an issue's user-facing message.
 *
 * Resolution order:
 * 1. If `templates[code]` exists, return `interpolate(template, issue.data)`.
 * 2. Else return `issue.message` (the default English rendering set at
 *    construction time).
 * 3. Else return `fallback`.
 *
 * The eager `message` written at construction time is what makes step 2
 * useful: a consumer with no catalog at all still gets something readable,
 * and a consumer with a partial catalog falls back per-code rather than
 * all-or-nothing.
 */
export function formatIssue(
    issue: Issue,
    templates?: IssueMessageTemplates,
    fallback: string = '',
): string {
    if (templates && issue.code) {
        const template = templates[issue.code];

        if (typeof template === 'string') {
            return interpolate(template, issue.data || {});
        }
    }

    if (typeof issue.message === 'string' && issue.message.length > 0) {
        return issue.message;
    }

    return fallback;
}
