import { ServerError } from '../base';
import { Input } from '../../types';

export const NotImplementedErrorOptions = {
    code: `NOT_IMPLEMENTED`,
    statusCode: 501,
    statusMessage: `Not Implemented`
} as const;

export class NotImplementedError extends ServerError {
    constructor(...input: Input[]) {
        super(NotImplementedErrorOptions, ...input);
    }
}
