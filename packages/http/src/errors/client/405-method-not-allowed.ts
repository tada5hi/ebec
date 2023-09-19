import { ClientError } from '../base';
import { Input } from '../../types';

export const MethodNotAllowedErrorOptions = {
    code: `METHOD_NOT_ALLOWED`,
    statusCode: 405,
    statusMessage: `Method Not Allowed`
} as const;

export class MethodNotAllowedError extends ClientError {
    constructor(...input: Input[]) {
        super(MethodNotAllowedErrorOptions, ...input);
    }
}
