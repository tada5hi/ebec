import { ClientError } from '../base';
import { Input } from '../../types';

export const RequestedRangeNotSatisfiableErrorOptions = {
    code: `REQUESTED_RANGE_NOT_SATISFIABLE`,
    statusCode: 416,
    statusMessage: `Requested Range Not Satisfiable`
} as const;

export class RequestedRangeNotSatisfiableError extends ClientError {
    constructor(...input: Input[]) {
        super(RequestedRangeNotSatisfiableErrorOptions, ...input);
    }
}
