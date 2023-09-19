import { ClientError } from '../base';
import { Input } from '../../types';

export const NotFoundErrorOptions = {
    code: `NOT_FOUND`,
    statusCode: 404,
    statusMessage: `Not Found`
} as const;

export class NotFoundError extends ClientError {
    constructor(...input: Input[]) {
        super(NotFoundErrorOptions, ...input);
    }
}
