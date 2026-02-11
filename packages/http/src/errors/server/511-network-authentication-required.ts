import { ServerError } from '../base';
import type { Input } from '../../types';

export const NetworkAuthenticationRequiredErrorOptions = {
    code: 'NETWORK_AUTHENTICATION_REQUIRED',
    statusCode: 511,
    statusMessage: 'Network Authentication Required',
} as const;

export class NetworkAuthenticationRequiredError extends ServerError {
    constructor(...input: Input[]) {
        super(NetworkAuthenticationRequiredErrorOptions, ...input);
    }
}
