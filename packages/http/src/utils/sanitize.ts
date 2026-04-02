// ASCII printable characters only (0x20 space through 0x7E tilde)
 
const pattern = /[^\x20-\x7E]/g;

const MAX_STATUS_MESSAGE_LENGTH = 256;

export function sanitizeStatusMessage(input: string) {
    return input.replace(pattern, '').trim().slice(0, MAX_STATUS_MESSAGE_LENGTH);
}

export function sanitizeStatusCode(input: string | number) {
    const code = Number.parseInt(`${input}`, 10);

    if (!Number.isInteger(code) || code < 100 || code > 599) {
        return 500;
    }

    return code;
}
