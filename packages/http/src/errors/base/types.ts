export interface IHTTPError {
    statusCode: number;
    statusMessage?: string;
    redirectURL?: string;
}

export interface IClientError extends IHTTPError {}

export interface IServerError extends IHTTPError {}
