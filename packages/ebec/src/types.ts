export type Options = {
    /**
     * The actual error message, if not provided on another way.
     */
    message?: string,

    /**
     * Trace of which functions were called.
     */
    stack?: string

    /**
     * A unique identifier for the error,
     * which can be a short uppercase string or a numeric code.
     */
    code?: string | number | null,

    /**
     * Additional data associated with the error. This property can hold
     * unstructured information or supplementary details that provide context
     * to the error.
     */
    data?: unknown,

    /**
     * Determines whether the error message can be safely exposed externally.
     */
    expose?: boolean;

    /**
     * Indicates whether the error should be logged in the application's logs.
     */
    logMessage?: boolean,

    /**
     * Specifies the log level at which this error should be recorded.
     */
    logLevel?: string | number,

    /**
     * Represents the underlying cause or source of the error.
     */
    cause?: unknown
};

export type Input = Options | Error | string;
