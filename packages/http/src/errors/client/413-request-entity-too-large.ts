import { ClientError } from '../base';
import { Input } from '../../types';

export const RequestEntityTooLargeErrorOptions = {
    code: `REQUEST_ENTITY_TOO_LARGE`,
    statusCode: 413,
    statusMessage: `REQUEST_ENTITY_TOO_LARGE`
} as const;

export class RequestEntityTooLargeError extends ClientError {
    constructor(...input: Input[]) {
        super(RequestEntityTooLargeErrorOptions, ...input);
    }
}
