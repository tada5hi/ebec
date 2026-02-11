import { ClientError } from '../base';
import type { Input } from '../../types';

export const ImATeapotErrorOptions = {
    code: 'IM_A_TEAPOT',
    statusCode: 418,
    statusMessage: 'I&#39;m a Teapot',
} as const;

export class ImATeapotError extends ClientError {
    constructor(...input: Input[]) {
        super(ImATeapotErrorOptions, ...input);
    }
}
