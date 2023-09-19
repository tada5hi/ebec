import { ClientError } from '../base';
import { Input } from '../../types';

export const EnhanceYourCalmErrorOptions = {
    code: `ENHANCE_YOUR_CALM`,
    statusCode: 420,
    statusMessage: `Enhance Your Calm`
} as const;

export class EnhanceYourCalmError extends ClientError {
    constructor(...input: Input[]) {
        super(EnhanceYourCalmErrorOptions, ...input);
    }
}
