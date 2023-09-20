export type Options = {
    /**
     * The actual error message, if not provided on another way.
     */
    message?: string,

    /**
     * The error code is either a short uppercase string identifier
     * for the error or a numeric error code. For example: SERVER_ERROR
     */
    code?: string | number | null,

    /**
     * Can the error message be exposed externally without hesitation
     * or is it restricted for internal use?
     */
    expose?: boolean;

    /**
     * Should the error be logged?
     */
    logMessage?: boolean,

    /**
     * Set the log level for this error.
     */
    logLevel?: string | number,

    /**
     * A cause for the error.
     */
    cause?: unknown,
};

export type Input = Options | Error | string;
