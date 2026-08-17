import { IssueCode, defineIssueItem } from '@ebec/core';
import { describe, expect, it } from 'vitest';
import { BadRequestError } from '../../src';

function nameIssue() {
    return defineIssueItem({
        code: IssueCode.REQUIRED,
        path: ['name'],
        message: 'Name is required',
    });
}

describe('http issues', () => {
    it('should default issues to an empty array', () => {
        const error = new BadRequestError('nope');

        expect(error.issues).toEqual([]);
    });

    it('should carry issues on a generated error class', () => {
        const issue = nameIssue();
        const error = new BadRequestError({ message: 'validation failed', issues: [issue] });

        expect(error.status).toEqual(400);
        expect(error.issues).toEqual([issue]);
    });

    it('should serialize issues alongside the status', () => {
        const issue = nameIssue();
        const error = new BadRequestError({ issues: [issue] });
        const output = error.toJSON();

        expect(output.status).toEqual(400);
        expect(output.issues).toEqual([issue]);
    });
});
