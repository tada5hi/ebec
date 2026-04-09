export function sanitizeStatusCode(input: string | number) {
    const code = Number.parseInt(`${input}`, 10);

    if (!Number.isInteger(code) || code < 100 || code > 599) {
        return 500;
    }

    return code;
}
