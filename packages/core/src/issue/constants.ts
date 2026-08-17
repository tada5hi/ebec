/*
 * Copyright (c) 2026.
 * Author Peter Placzek (tada5hi)
 * For the full copyright and license information,
 * view the LICENSE file that was distributed with this source code.
 */

/**
 * Vocabulary of well-known issue codes. Validators map their own failure
 * kinds onto these so consumer-side translation catalogs can ship one
 * localized message per code instead of falling back to a generic
 * "invalid value".
 *
 * Tracks the common ground between vuelidate, zod, joi, yup and
 * validator.js. The list lifts from vuelidate's catalog (snake_cased);
 * modern format codes (`PATTERN`, `UUID`, `DATE`, `JSON`, `BASE64`,
 * `STRONG_PASSWORD`, …) cover ground vuelidate predates. Every format
 * code names the format positively (`UUID`, `EMAIL`, `URL`, …) rather
 * than the failure mode (`NOT_UUID`, `INVALID_EMAIL`) so the registry
 * reads consistently.
 *
 * **This vocabulary is a default, not a requirement.** `IssueItem.code`
 * is widened to `IssueCode | (string & {})`, so a library with its own
 * vocabulary — `rapiq`'s `key_not_allowed`, an app's `email_taken` —
 * emits well-formed issues without touching this const at all. If you
 * want a typed const for your own codes, define one alongside this one:
 *
 * ```ts
 * import { IssueCode } from '@ebec/core';
 *
 * export const AppCode = {
 *     ...IssueCode,
 *     EMAIL_TAKEN: 'email_taken',
 * } as const;
 * ```
 *
 * Each entry's JSDoc documents the structured `data` producers should
 * attach when constructing the issue — templates can rely on those
 * placeholders being present (`{min}`, `{max}`, `{other}`, etc.).
 */
export const IssueCode = {
    // ──────────────────────────── Generic / structural ────────────────────────────
    /** Generic fallback when no more-specific code applies. `data`: — */
    VALUE_INVALID: 'value_invalid',
    /** Every branch of a `oneOf` alternative failed. `data`: — */
    ONE_OF_FAILED: 'one_of_failed',

    // ──────────────────────────── Presence ────────────────────────────
    /** Value is missing, `undefined`, `null`, or empty per the validator's semantics. `data`: — */
    REQUIRED: 'required',

    // ──────────────────────────── Type assertions ────────────────────────────
    /** Value contains characters outside the alphabetical set. `data`: — */
    ALPHA: 'alpha',
    /** Value contains characters outside the alphanumeric set. `data`: — */
    ALPHA_NUM: 'alpha_num',
    /** Value is not a number. `data`: — */
    NUMERIC: 'numeric',
    /** Value is not an integer. `data`: — */
    INTEGER: 'integer',
    /** Value is not a decimal number. `data`: — */
    DECIMAL: 'decimal',

    // ──────────────────────────── Length (strings, arrays) ────────────────────────────
    /** Value is shorter than the configured minimum. `data`: `{ min: number }` */
    MIN_LENGTH: 'min_length',
    /** Value is longer than the configured maximum. `data`: `{ max: number }` */
    MAX_LENGTH: 'max_length',

    // ──────────────────────────── Numeric range ────────────────────────────
    /** Numeric value is below the configured minimum. `data`: `{ min: number }` */
    MIN_VALUE: 'min_value',
    /** Numeric value is above the configured maximum. `data`: `{ max: number }` */
    MAX_VALUE: 'max_value',
    /** Numeric value falls outside the configured `[min, max]` range. `data`: `{ min: number, max: number }` */
    BETWEEN: 'between',

    // ──────────────────────────── String format ────────────────────────────
    /** Value is not a valid email address. `data`: — */
    EMAIL: 'email',
    /** Value is not a valid URL. `data`: — */
    URL: 'url',
    /** Value is not a valid IP address. `data`: — */
    IP_ADDRESS: 'ip_address',
    /** Value is not a valid MAC address. `data`: — */
    MAC_ADDRESS: 'mac_address',
    /** Value is not a valid UUID. `data`: — */
    UUID: 'uuid',
    /** Value is not a valid date / cannot be parsed as a date. `data`: — */
    DATE: 'date',
    /**
     * Value does not match the expected regex pattern. `data`:
     * `{ pattern: string }` — source of the regex without flags so
     * catalogs can quote it in human-readable form.
     */
    PATTERN: 'pattern',
    /** Value is not valid JSON. `data`: — */
    JSON: 'json',
    /** Value is not valid base64. `data`: — */
    BASE64: 'base64',
    /**
     * Value does not meet the configured strong-password rules. `data`:
     * `{ minLength?: number, minLowercase?: number, minUppercase?: number,
     * minNumbers?: number, minSymbols?: number }` — only the keys the
     * producer chose to surface; missing keys mean "the default for that
     * setting wasn't configured."
     */
    STRONG_PASSWORD: 'strong_password',

    // ──────────────────────────── Comparison ────────────────────────────
    /**
     * Value must equal another named field's value (sibling-field assertion,
     * e.g. password-confirm). `data`: `{ other: string }` — the name of
     * the field being compared against.
     */
    SAME_AS: 'same_as',
} as const;

export type IssueCode = typeof IssueCode[keyof typeof IssueCode];

/**
 * Per-code `data` contract for the well-known vocabulary. Producers
 * ({@link defineIssueItem} and anything layered on top of it) thread this
 * through their type signatures so TS rejects mismatched payloads at
 * compile time — e.g. `STRONG_PASSWORD` with `data: { pointsPerUnique: 5 }`
 * (a validator.js scoring weight, not a strength requirement) fails to
 * type-check. Codes absent from this map carry no `data`; ad-hoc string
 * codes fall back to the open `Record<string, unknown>` shape on the raw
 * `IssueItem` branch.
 *
 * Extensible via TypeScript declaration merging — libraries and apps that
 * want typed data for their own codes can augment this interface, and the
 * producer-side gatekeep will type-check their payloads too:
 *
 * ```ts
 * // In a library or app:
 * declare module '@ebec/core' {
 *     interface IssueDataByCode {
 *         email_taken: { existingUserId: string };
 *     }
 * }
 *
 * defineIssueItem({
 *     code: 'email_taken',
 *     path: ['email'],
 *     message: 'Already in use',
 *     data: { existingUserId: 'u_42' }, // typed and required
 * });
 * ```
 *
 * The augmentation also reaches through a re-exporting package: a
 * consumer of a library that does `export * from '@ebec/core'` may write
 * `declare module '<that-library>'` and the merge still lands on this
 * interface, so `ParameterizedIssueCode` picks the new code up.
 *
 * Keep entries here in lockstep with the JSDoc on the corresponding
 * {@link IssueCode} entry — the type-level enforcement and the
 * documentation are two views of the same contract.
 */
export interface IssueDataByCode {
    min_length: { min: number };
    max_length: { max: number };
    min_value: { min: number };
    max_value: { max: number };
    between: { min: number, max: number };
    pattern: { pattern: string };
    strong_password: {
        minLength?: number,
        minLowercase?: number,
        minUppercase?: number,
        minNumbers?: number,
        minSymbols?: number,
    };
    same_as: { other: string };
}

/**
 * `IssueCode` values that carry a documented `data` payload — keys of
 * {@link IssueDataByCode}. Producers using one of these codes must
 * supply the matching `data` shape.
 */
export type ParameterizedIssueCode = keyof IssueDataByCode;

/**
 * `IssueCode` values that carry no `data` (`VALUE_INVALID`, `EMAIL`,
 * `REQUIRED`, …). Producers using one of these codes must omit `data`
 * (or pass `undefined`).
 */
export type BareIssueCode = Exclude<IssueCode, ParameterizedIssueCode>;
