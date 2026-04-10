export function sanitizeStatusCode(input?: string | number | null) {
    if (input === null || typeof input === 'undefined') {
        return 500;
    }

    const code = Number.parseInt(`${input}`, 10);

    if (!Number.isInteger(code) || code < 400 || code > 599) {
        return 500;
    }

    return code;
}
