import { describe, expect, it } from 'vitest';
import { STATUS_TEXTS, getStatusText } from '../../../src';

describe('getStatusText', () => {
    it('should return status text for known client error codes', () => {
        expect(getStatusText(400)).toBe('Bad Request');
        expect(getStatusText(404)).toBe('Not Found');
        expect(getStatusText(418)).toBe("I'm a Teapot");
    });

    it('should return status text for known server error codes', () => {
        expect(getStatusText(500)).toBe('Internal Server Error');
        expect(getStatusText(502)).toBe('Bad Gateway');
    });

    it('should return undefined for unknown status codes', () => {
        expect(getStatusText(200)).toBeUndefined();
        expect(getStatusText(999)).toBeUndefined();
    });
});

describe('STATUS_TEXTS', () => {
    it('should contain all client error codes', () => {
        expect(STATUS_TEXTS[400]).toBe('Bad Request');
        expect(STATUS_TEXTS[414]).toBe('Request-URI Too Long');
    });

    it('should contain all server error codes', () => {
        expect(STATUS_TEXTS[500]).toBe('Internal Server Error');
        expect(STATUS_TEXTS[511]).toBe('Network Authentication Required');
    });
});
