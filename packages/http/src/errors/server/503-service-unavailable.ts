import { ServerError } from '../base';
import type { Input } from '../../types';

export const ServiceUnavailableErrorOptions = {
    code: 'SERVICE_UNAVAILABLE',
    statusCode: 503,
    statusMessage: 'Service Unavailable',
} as const;

export class ServiceUnavailableError extends ServerError {
    constructor(...input: Input[]) {
        super(ServiceUnavailableErrorOptions, ...input);
    }
}
