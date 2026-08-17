import { IssueCode, defineIssueGroup, defineIssueItem } from 'blemish';
import { describe, expect, it } from 'vitest';
import { BaseError } from '../../src';

function requiredIssue() {
    return defineIssueItem({
        code: IssueCode.REQUIRED,
        path: ['user', 'name'],
        message: 'Name is required',
    });
}

function emailIssue() {
    return defineIssueItem({
        code: IssueCode.EMAIL,
        path: ['user', 'contact', 'email'],
        message: 'Not a valid email address',
    });
}

describe('issues', () => {
    it('should default issues to an empty array', () => {
        const error = new BaseError('simple');

        expect(error.issues).toEqual([]);
    });

    it('should create instance with issues option', () => {
        const issue = requiredIssue();
        const error = new BaseError({ message: 'validation failed', issues: [issue] });

        expect(error.issues).toEqual([issue]);
    });

    it('should copy the issues array instead of aliasing it', () => {
        const issues = [requiredIssue()];
        const error = new BaseError({ issues });

        issues.push(emailIssue());

        expect(error.issues).toHaveLength(1);
    });

    it('should preserve group nodes instead of flattening them', () => {
        const group = defineIssueGroup({
            code: IssueCode.ONE_OF_FAILED,
            path: ['user', 'contact'],
            message: 'No contact method was valid',
            issues: [emailIssue()],
        });
        const error = new BaseError({ issues: [group] });

        expect(error.issues).toHaveLength(1);
        expect(error.issues[0]).toBe(group);
    });
});
