import type { IBaseError } from '@ebec/core';

export interface IHTTPError extends IBaseError {
    statusCode: number;
    statusMessage?: string;
    redirectURL?: string;
}

export interface IClientError extends IHTTPError {}

export interface IServerError extends IHTTPError {}
