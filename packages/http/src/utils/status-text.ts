import { STATUS_TEXTS } from '../constants';

export function getStatusText(statusCode: number): string | undefined {
    if (statusCode in STATUS_TEXTS) {
        return STATUS_TEXTS[statusCode as keyof typeof STATUS_TEXTS];
    }

    return undefined;
}
