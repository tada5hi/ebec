import { ClientError } from '../base';
import { Input } from '../../types';

export const ClientClosedRequestErrorOptions = {
    code: `CLIENT_CLOSED_REQUEST`,
    statusCode: 499,
    statusMessage: `Client Closed Request`
} as const;

export class ClientClosedRequestError extends ClientError {
    constructor(...input: Input[]) {
        super(ClientClosedRequestErrorOptions, ...input);
    }
}
