import { ClientError } from '../base';
import { Input } from '../../types';

export const FailedDependencyErrorOptions = {
    code: `FAILED_DEPENDENCY`,
    statusCode: 424,
    statusMessage: `Failed Dependency`
} as const;

export class FailedDependencyError extends ClientError {
    constructor(...input: Input[]) {
        super(FailedDependencyErrorOptions, ...input);
    }
}
