import { ClientError } from '../base';
import { Input } from '../../types';

export const UnsupportedMediaTypeErrorOptions = {
    code: `UNSUPPORTED_MEDIA_TYPE`,
    statusCode: 415,
    statusMessage: `Unsupported Media Type`
} as const;

export class UnsupportedMediaTypeError extends ClientError {
    constructor(...input: Input[]) {
        super(UnsupportedMediaTypeErrorOptions, ...input);
    }
}
