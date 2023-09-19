import { ServerError } from '../base';
import { Input } from '../../types';

export const InternalServerErrorOptions = {
    code: `INTERNAL_SERVER_ERROR`,
    statusCode: 500,
    statusMessage: `Internal Server Error`
} as const;

export class InternalServerError extends ServerError {
    constructor(...input: Input[]) {
        super(InternalServerErrorOptions, ...input);
    }
}
