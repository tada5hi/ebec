/* eslint-disable max-classes-per-file */
import { describe, expect, it } from 'vitest';
import {
    BASE_ERROR_INSTANCE,
    BaseError,
    INSTANCEOF_PROPERTY,
    hasInstanceof,
    isBaseError,
    markInstanceof,
} from '../../src';

describe('src/helpers/instanceof.ts', () => {
    describe('markInstanceof', () => {
        it('should attach the marker chain on first call', () => {
            const target = {};
            const marker = Symbol.for('@ebec-test/Foo');

            markInstanceof(target, marker);

            const chain = (target as Record<string, unknown>)[INSTANCEOF_PROPERTY];
            expect(Array.isArray(chain)).toBe(true);
            expect(chain).toEqual([marker]);
        });

        it('should append additional markers to the existing chain', () => {
            const target = {};
            const fooMarker = Symbol.for('@ebec-test/Foo');
            const barMarker = Symbol.for('@ebec-test/Bar');

            markInstanceof(target, fooMarker);
            markInstanceof(target, barMarker);

            const chain = (target as Record<string, unknown>)[INSTANCEOF_PROPERTY];
            expect(chain).toEqual([fooMarker, barMarker]);
        });

        it('should be idempotent for the same marker', () => {
            const target = {};
            const marker = Symbol.for('@ebec-test/Foo');

            markInstanceof(target, marker);
            markInstanceof(target, marker);
            markInstanceof(target, marker);

            const chain = (target as Record<string, unknown>)[INSTANCEOF_PROPERTY];
            expect(chain).toEqual([marker]);
        });

        it('should install a non-enumerable, non-writable, non-configurable property', () => {
            const target = {};
            const marker = Symbol.for('@ebec-test/Descriptor');

            markInstanceof(target, marker);

            const descriptor = Object.getOwnPropertyDescriptor(target, INSTANCEOF_PROPERTY);
            expect(descriptor).toBeDefined();
            expect(descriptor?.enumerable).toBe(false);
            expect(descriptor?.writable).toBe(false);
            expect(descriptor?.configurable).toBe(false);
        });

        it('should keep the chain out of JSON.stringify output', () => {
            const target: Record<string, unknown> = { foo: 1 };
            const marker = Symbol.for('@ebec-test/Json');

            markInstanceof(target, marker);

            expect(JSON.stringify(target)).toEqual('{"foo":1}');
            expect(Object.keys(target)).toEqual(['foo']);
        });
    });

    describe('hasInstanceof', () => {
        it('should match a marker present in the chain', () => {
            const target = {};
            const marker = Symbol.for('@ebec-test/Hit');

            markInstanceof(target, marker);

            expect(hasInstanceof(target, marker)).toBe(true);
        });

        it('should not match a marker absent from the chain', () => {
            const target = {};
            const present = Symbol.for('@ebec-test/Present');
            const absent = Symbol.for('@ebec-test/Absent');

            markInstanceof(target, present);

            expect(hasInstanceof(target, absent)).toBe(false);
        });

        it('should return false for objects without the chain', () => {
            expect(hasInstanceof({}, Symbol.for('@ebec-test/None'))).toBe(false);
        });

        it('should return false for non-object inputs', () => {
            const marker = Symbol.for('@ebec-test/NonObject');

            expect(hasInstanceof(undefined, marker)).toBe(false);
            expect(hasInstanceof(null, marker)).toBe(false);
            expect(hasInstanceof('string', marker)).toBe(false);
            expect(hasInstanceof(42, marker)).toBe(false);
            expect(hasInstanceof(true, marker)).toBe(false);
        });

        it('should return false defensively when the chain is not an array', () => {
            const target = { [INSTANCEOF_PROPERTY]: 'not-an-array' };
            const marker = Symbol.for('@ebec-test/Defensive');

            expect(hasInstanceof(target, marker)).toBe(false);
        });
    });

    describe('cross-realm identity via Symbol.for', () => {
        it('should match across independent Symbol.for lookups for the same key', () => {
            const target = {};

            markInstanceof(target, Symbol.for('@ebec-test/CrossRealm'));

            // Simulate a check from another bundle / realm — a fresh Symbol.for
            // lookup with the same key resolves to the identical symbol.
            expect(hasInstanceof(target, Symbol.for('@ebec-test/CrossRealm'))).toBe(true);
        });

        it('should not match unrelated Symbol() instances with the same description', () => {
            const target = {};

            markInstanceof(target, Symbol.for('@ebec-test/Local'));

            // A locally-scoped Symbol() with the same description is a
            // different identity and must not collide with the global one.
            expect(hasInstanceof(target, Symbol('@ebec-test/Local'))).toBe(false);
        });
    });

    describe('BaseError self-marking', () => {
        it('should attach BASE_ERROR_INSTANCE to every BaseError instance', () => {
            const error = new BaseError('boom');

            expect(hasInstanceof(error, BASE_ERROR_INSTANCE)).toBe(true);
        });

        it('should resolve BASE_ERROR_INSTANCE via Symbol.for across lookups', () => {
            const error = new BaseError();

            expect(hasInstanceof(error, Symbol.for('@ebec/core/BaseError'))).toBe(true);
        });

        it('should let isBaseError fast-path-match a marker-only foreign object', () => {
            const foreign: Record<string, unknown> = {};
            Object.defineProperty(foreign, INSTANCEOF_PROPERTY, {
                value: [BASE_ERROR_INSTANCE],
                enumerable: false,
            });

            expect(isBaseError(foreign)).toBe(true);
        });
    });

    describe('inheritance chain accumulation', () => {
        const FOO_INSTANCE = Symbol.for('@ebec-test/FooError');
        const BAR_INSTANCE = Symbol.for('@ebec-test/BarError');

        class FooError extends BaseError {
            constructor(input?: ConstructorParameters<typeof BaseError>[0]) {
                super(input);
                markInstanceof(this, FOO_INSTANCE);
            }
        }

        class BarError extends FooError {
            constructor(input?: ConstructorParameters<typeof BaseError>[0]) {
                super(input);
                markInstanceof(this, BAR_INSTANCE);
            }
        }

        it('should accumulate markers from every ancestor in the chain', () => {
            const bar = new BarError();
            const chain = (bar as unknown as Record<string, unknown>)[INSTANCEOF_PROPERTY];

            // BaseError self-marks first, then each subclass appends after super().
            expect(chain).toEqual([BASE_ERROR_INSTANCE, FOO_INSTANCE, BAR_INSTANCE]);
        });

        it('should let a parent-class guard fast-path-match a subclass instance', () => {
            const bar = new BarError();

            expect(hasInstanceof(bar, FOO_INSTANCE)).toBe(true);
            expect(hasInstanceof(bar, BAR_INSTANCE)).toBe(true);
        });

        it('should not flag a parent instance with a child marker', () => {
            const foo = new FooError();

            expect(hasInstanceof(foo, FOO_INSTANCE)).toBe(true);
            expect(hasInstanceof(foo, BAR_INSTANCE)).toBe(false);
        });
    });
});
