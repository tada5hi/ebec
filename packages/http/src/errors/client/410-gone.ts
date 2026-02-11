import { ClientError } from '../base';
import type { Input } from '../../types';

export const GoneErrorOptions = {
    code: 'GONE',
    statusCode: 410,
    statusMessage: 'Gone',
} as const;

export class GoneError extends ClientError {
    constructor(...input: Input[]) {
        super(GoneErrorOptions, ...input);
    }
}
