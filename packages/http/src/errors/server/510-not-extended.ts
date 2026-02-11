import { ServerError } from '../base';
import type { Input } from '../../types';

export const NotExtendedErrorOptions = {
    code: 'NOT_EXTENDED',
    statusCode: 510,
    statusMessage: 'Not Extended',
} as const;

export class NotExtendedError extends ServerError {
    constructor(...input: Input[]) {
        super(NotExtendedErrorOptions, ...input);
    }
}
