/*
 * Copyright (c) 2026.
 *  Author Peter Placzek (tada5hi)
 *  For the full copyright and license information,
 *  view the LICENSE file that was distributed with this source code.
 */
import type { Issue } from 'blemish';

export type ErrorOptions = {
    /**
     * The actual error message, if not provided on another way.
     */
    message?: string,

    /**
     * Trace of which functions were called.
     */
    stack?: string

    /**
     * A unique identifier for the error.
     */
    code?: string,

    /**
     * Data used for message template interpolation.
     * Not stored on the error instance.
     */
    messageData?: Record<string, unknown>,

    /**
     * Represents the underlying cause or source of the error.
     */
    cause?: unknown,

    /**
     * A collection of errors for batch/group error scenarios.
     */
    errors?: Error[],

    /**
     * Structured validation failures, as a blemish issue tree.
     *
     * Stored as given — group nodes keep their children, since flattening
     * is `flattenIssueItems`' job at the consumer.
     */
    issues?: Issue[],
};
