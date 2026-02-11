import { ClientError } from '../base';
import type { Input } from '../../types';

export const BadRequestErrorOptions = {
    code: 'BAD_REQUEST',
    statusCode: 400,
    statusMessage: 'Bad Request',
} as const;

export class BadRequestError extends ClientError {
    constructor(...input: Input[]) {
        super(BadRequestErrorOptions, ...input);
    }
}
