/*
 * Copyright (c) 2023.
 * Author Peter Placzek (tada5hi)
 * For the full copyright and license information,
 * view the LICENSE file that was distributed with this source code.
 */

/**
 * \x20-\x7E: This range represents printable ASCII characters. \x20 is the hexadecimal code for space, and \x7E is the code for tilde.
 * \t: Matches the tab character.
 * \n: Matches the newline character.
 * \r: Matches the carriage return character.
 * \x0B: Matches the vertical tab character.
 * \x0C: Matches the form feed character.
 */
const pattern = /[^\x20-\x7E\t\n\r\x0B\x0C]+/g;

export function sanitizeStatusMessage(input: string) {
    return input.replace(pattern, '');
}

export function sanitizeStatusCode(input: string | number) {
    const code = parseInt(`${input}`, 10);

    if (!Number.isInteger(code) || code < 100 || code > 599) {
        return 500;
    }

    return code;
}
