export function isObject(item: unknown) : item is Record<string, any> {
    return (!!item && typeof item === 'object' && !Array.isArray(item));
}

export function isErrorCode(input?: unknown) : input is string | number | null {
    return typeof input === 'number' ||
        typeof input === 'string' ||
        input === null;
}

export function isErrorExpose(input?: unknown): input is boolean {
    return typeof input === 'boolean';
}

export function isErrorMessage(input: unknown): input is string {
    return typeof input === 'string';
}

export function isErrorLogMessage(
    input: unknown,
): input is boolean {
    return typeof input === 'boolean';
}

export function isErrorLogLevel(input: unknown) : input is string | number {
    return typeof input === 'number' ||
        typeof input === 'string';
}

export function isErrorStack(input: unknown): input is string {
    return typeof input === 'string';
}

export function isError(input: unknown) : input is Error {
    if (!isObject(input)) {
        return false;
    }

    return isErrorMessage(input.message) &&
        isErrorStack(input.stack);
}
