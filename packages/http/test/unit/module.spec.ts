import {
    BaseError,
    INSTANCEOF_PROPERTY,
    hasInstanceof,
    matchesInstanceof,
} from '@ebec/core';
import { describe, expect, it } from 'vitest';
import {
    BAD_REQUEST_ERROR_INSTANCE,
    BadRequestError,
    CLIENT_ERROR_INSTANCE,
    ClientError,
    HTTPError,
    HTTP_ERROR_INSTANCE,
    INTERNAL_SERVER_ERROR_INSTANCE,
    InternalServerError,
    NOT_FOUND_ERROR_INSTANCE,
    NotFoundError,
    SERVER_ERROR_INSTANCE,
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

        // A chain-less plain Error with a status bolted on no longer matches —
        // identity is chain-only now, there is no shape/status fallback.
        const t2 = new Error();
        (t2 as Record<string, unknown>).statusCode = 500;
        (t2 as Record<string, unknown>).code = 'SERVER_ERROR';
        expect(isClientError(t2)).toBeFalsy();
        expect(isServerError(t2)).toBeFalsy();
        expect(isHTTPError(t2)).toBeFalsy();
    });

    it('should normalize non-error status to 500', () => {
        const error = new HTTPError({ statusCode: 300 });
        expect(error.status).toEqual(500);
        expect(isServerError(error)).toBeTruthy();
        expect(isHTTPError(error)).toBeTruthy();
    });

    it('should not recognize non-HTTPError as http error', () => {
        expect(isHTTPError(undefined)).toBeFalsy();
    });

    describe('instanceof markers', () => {
        it('should attach a Symbol.for marker chain to every HTTPError instance', () => {
            const error = new HTTPError({ status: 418 });

            expect(hasInstanceof(error, HTTP_ERROR_INSTANCE)).toBe(true);
            expect(hasInstanceof(error, CLIENT_ERROR_INSTANCE)).toBe(false);
            expect(hasInstanceof(error, SERVER_ERROR_INSTANCE)).toBe(false);
        });

        it('should accumulate ancestor markers on ClientError subclasses', () => {
            const error = new BadRequestError();

            expect(hasInstanceof(error, HTTP_ERROR_INSTANCE)).toBe(true);
            expect(hasInstanceof(error, CLIENT_ERROR_INSTANCE)).toBe(true);
            expect(hasInstanceof(error, BAD_REQUEST_ERROR_INSTANCE)).toBe(true);
            expect(hasInstanceof(error, NOT_FOUND_ERROR_INSTANCE)).toBe(false);
            expect(hasInstanceof(error, SERVER_ERROR_INSTANCE)).toBe(false);
        });

        it('should accumulate ancestor markers on ServerError subclasses', () => {
            const error = new InternalServerError();

            expect(hasInstanceof(error, HTTP_ERROR_INSTANCE)).toBe(true);
            expect(hasInstanceof(error, SERVER_ERROR_INSTANCE)).toBe(true);
            expect(hasInstanceof(error, INTERNAL_SERVER_ERROR_INSTANCE)).toBe(true);
            expect(hasInstanceof(error, CLIENT_ERROR_INSTANCE)).toBe(false);
        });

        it('should resolve markers across independent Symbol.for lookups (cross-realm)', () => {
            const error = new NotFoundError();

            // A fresh lookup with the same key resolves to the identical symbol —
            // this is what makes the marker survive cross-bundle / cross-realm boundaries.
            expect(hasInstanceof(error, Symbol.for('@ebec/http/HTTPError'))).toBe(true);
            expect(hasInstanceof(error, Symbol.for('@ebec/http/ClientError'))).toBe(true);
            expect(hasInstanceof(error, Symbol.for('@ebec/http/NotFoundError'))).toBe(true);
        });

        it('should let isHTTPError fast-path-match a marker-only object', () => {
            // Simulate a foreign-realm instance: no prototype link, just the chain.
            const foreign: Record<string, unknown> = {};
            Object.defineProperty(foreign, INSTANCEOF_PROPERTY, {
                value: [HTTP_ERROR_INSTANCE, CLIENT_ERROR_INSTANCE],
                enumerable: false,
            });

            expect(isHTTPError(foreign)).toBe(true);
            expect(isClientError(foreign)).toBe(true);
            expect(isServerError(foreign)).toBe(false);
        });

        it('should emit the full marker chain in toJSON output', () => {
            const error = new NotFoundError('User not found');
            const json = error.toJSON();

            expect((json as Record<string, unknown>)[INSTANCEOF_PROPERTY]).toEqual([
                '@ebec/core/BaseError',
                '@ebec/http/HTTPError',
                '@ebec/http/ClientError',
                '@ebec/http/NotFoundError',
            ]);
        });

        it('should keep the ancestor match for a JSON-rehydrated subclass error', () => {
            const rehydrated = JSON.parse(JSON.stringify(new NotFoundError()));

            // Symbols are dropped by JSON.stringify — the strict form no
            // longer matches, the serialized string form does.
            expect(hasInstanceof(rehydrated, CLIENT_ERROR_INSTANCE)).toBe(false);
            expect(matchesInstanceof(rehydrated, NOT_FOUND_ERROR_INSTANCE)).toBe(true);
            expect(matchesInstanceof(rehydrated, CLIENT_ERROR_INSTANCE)).toBe(true);
            expect(matchesInstanceof(rehydrated, HTTP_ERROR_INSTANCE)).toBe(true);

            expect(isHTTPError(rehydrated)).toBe(true);
            expect(isClientError(rehydrated)).toBe(true);
            expect(isServerError(rehydrated)).toBe(false);
        });

        it('should reject chain-less legacy payloads now that there is no status-based fallback', () => {
            const rehydrated = JSON.parse(JSON.stringify(new InternalServerError()));
            delete rehydrated[INSTANCEOF_PROPERTY];

            // No chain, no identity — status alone no longer decides.
            expect(isHTTPError(rehydrated)).toBe(false);
            expect(isServerError(rehydrated)).toBe(false);
            expect(isClientError(rehydrated)).toBe(false);
        });

        it('should reject an error whose chain lacks the HTTP marker', () => {
            // Shaped like hapic's HttpResponseError: extends BaseError, carries an
            // upstream status, but never announces itself as an HTTPError.
            const upstream = {
                ...new BaseError({ message: 'upstream failed', code: 'UPSTREAM' }).toJSON(),
                status: 503,
            };

            expect(isHTTPError(upstream)).toBeFalsy();
            expect(isServerError(upstream)).toBeFalsy();
        });

        it('should reject a chain-less object now that there is no shape fallback', () => {
            expect(isHTTPError({
                message: 'x',
                code: 'y',
                status: 404,
            })).toBeFalsy();
        });

        it('should still accept a JSON round-tripped HTTP error', () => {
            const json = JSON.parse(JSON.stringify(new NotFoundError()));

            expect(isHTTPError(json)).toBeTruthy();
            expect(isClientError(json)).toBeTruthy();
        });

        it('should treat a bare HTTPError as a client error by status, not identity', () => {
            // isClientError is a status-range refinement of isHTTPError, not a
            // class-identity check: a plain HTTPError never marks itself with
            // CLIENT_ERROR_INSTANCE, yet still counts as a client error here.
            const bare = new HTTPError({ status: 404 });

            expect(isClientError(bare)).toBeTruthy();
            expect(bare.toJSON()[INSTANCEOF_PROPERTY]).not.toContain(CLIENT_ERROR_INSTANCE.description);
        });

        it('should reject a non-HTTP error even when its status is in range', () => {
            const upstream = {
                ...new BaseError({ message: 'upstream failed', code: 'UPSTREAM' }).toJSON(),
                status: 404,
            };

            expect(isClientError(upstream)).toBeFalsy();
        });
    });
});
