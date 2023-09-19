import { ClientError } from '../base';
import { Input } from '../../types';

export const NoResponseErrorOptions = {
    code: `NO_RESPONSE`,
    statusCode: 444,
    statusMessage: `No Response`
} as const;

export class NoResponseError extends ClientError {
    constructor(...input: Input[]) {
        super(NoResponseErrorOptions, ...input);
    }
}
