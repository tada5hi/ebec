import { ServerError } from '../base';
import type { Input } from '../../types';

export const GatewayTimeoutErrorOptions = {
    code: 'GATEWAY_TIMEOUT',
    statusCode: 504,
    statusMessage: 'Gateway Timeout',
} as const;

export class GatewayTimeoutError extends ServerError {
    constructor(...input: Input[]) {
        super(GatewayTimeoutErrorOptions, ...input);
    }
}
