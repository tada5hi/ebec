import { ServerError } from '../base';
import { Input } from '../../types';

export const BadGatewayErrorOptions = {
    code: `BAD_GATEWAY`,
    statusCode: 502,
    statusMessage: `Bad Gateway`
} as const;

export class BadGatewayError extends ServerError {
    constructor(...input: Input[]) {
        super(BadGatewayErrorOptions, ...input);
    }
}
