import { ClientError } from '../base';
import { Input } from '../../types';

export const ProxyAuthenticationRequiredErrorOptions = {
    code: `PROXY_AUTHENTICATION_REQUIRED`,
    statusCode: 407,
    statusMessage: `Proxy Authentication Required`
} as const;

export class ProxyAuthenticationRequiredError extends ClientError {
    constructor(...input: Input[]) {
        super(ProxyAuthenticationRequiredErrorOptions, ...input);
    }
}
