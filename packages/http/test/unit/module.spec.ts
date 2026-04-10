import { describe, expect, it } from 'vitest';
import {
    ClientError,
    HTTPError,
    InternalServerError,
    NotFoundError,
    ServerError,
    isClientError,
    isHTTPError,
    isServerError,
} from '../../src';

describe('src/module.ts', () => {
    it('should create instance with message', () => {
        const message = 'foo';
        const error = new HTTPError(message);

        expect(error.message).toEqual(message);
    });

    it('should create instance with options', () => {
        const error = new HTTPError({ statusCode: 490 });
        expect(error.status).toEqual(490);
        expect(error.statusCode).toEqual(490);
    });

    it('should create instance with status option', () => {
        const error = new HTTPError({ status: 490 });
        expect(error.status).toEqual(490);
        expect(error.statusCode).toEqual(490);
    });

    it('should default message to status text when no message provided', () => {
        const error = new HTTPError({ status: 404 });
        expect(error.message).toEqual('Not Found');
    });

    it('should preserve explicit message', () => {
        const error = new HTTPError({ status: 404, message: 'User not found' });
        expect(error.message).toEqual('User not found');
    });

    it('should fall back to default message for unknown status code', () => {
        const error = new HTTPError({ status: 490 });
        expect(error.message).toEqual('An error occurred');
    });

    it('should prefer status over deprecated statusCode when both are provided', () => {
        const error = new HTTPError({
            status: 418,
            statusCode: 404,
        });

        expect(error.status).toEqual(418);
        expect(error.statusCode).toEqual(418);
    });

    it('should sanitize status code', () => {
        const error = new HTTPError({ statusCode: 999 });
        expect(error.statusCode).toEqual(500);
    });

    it('should sanitize invalid status option', () => {
        const error = new HTTPError({ status: 999 });
        expect(error.status).toEqual(500);
        expect(error.statusCode).toEqual(500);
    });

    it('should allow status code override', () => {
        const error = new NotFoundError({ statusCode: 422 });
        expect(error.statusCode).toEqual(422);
    });

    it('should include status in toJSON', () => {
        const error = new NotFoundError('User not found');
        const json = error.toJSON();
        expect(json.status).toEqual(404);
        expect(json.message).toEqual('User not found');
        expect(json.code).toEqual('NOT_FOUND');
    });

    it('should recognize client error', () => {
        const error = new NotFoundError();
        expect(isClientError(error)).toBeTruthy();
        expect(isServerError(error)).toBeFalsy();
        expect(isHTTPError(error)).toBeTruthy();
    });

    it('should recognize server error', () => {
        const error = new InternalServerError();
        expect(isClientError(error)).toBeFalsy();
        expect(isServerError(error)).toBeTruthy();
        expect(isHTTPError(error)).toBeTruthy();
    });

    it('should recognize http error', () => {
        const t1 = new HTTPError({ statusCode: 400 });

        expect(isClientError(t1)).toBeTruthy();
        expect(isServerError(t1)).toBeFalsy();
        expect(isHTTPError(t1)).toBeTruthy();

        const t2 = new Error();
        (t2 as Record<string, unknown>).statusCode = 500;
        (t2 as Record<string, unknown>).code = 'SERVER_ERROR';
        expect(isClientError(t2)).toBeFalsy();
        expect(isServerError(t2)).toBeTruthy();
        expect(isHTTPError(t2)).toBeTruthy();
    });

    it('should not recognize http error', () => {
        const error = new HTTPError({ statusCode: 300 });

        expect(isClientError(error)).toBeFalsy();
        expect(isServerError(error)).toBeFalsy();
        expect(isHTTPError(error)).toBeFalsy();

        expect(isHTTPError(undefined)).toBeFalsy();
    });
});
