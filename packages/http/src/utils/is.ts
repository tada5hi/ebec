export function isErrorRedirectURL(input: unknown) : input is string {
    return typeof input === 'string';
}

export function isErrorStatusCode(input: unknown) : input is number {
    return typeof input === 'number';
}

export function isErrorStatusCodeInput(input: unknown) : input is string | number {
    return typeof input === 'number' ||
        typeof input === 'string';
}

export function isErrorStatusMessage(input: unknown) : input is string {
    return typeof input === 'string';
}
