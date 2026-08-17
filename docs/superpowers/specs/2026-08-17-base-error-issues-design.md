# `BaseError.issues` — integrating the blemish issue model

**Date:** 2026-08-17
**Status:** Approved, not yet implemented
**Scope:** `tada5hi/blemish` (prerequisite patch) and `tada5hi/ebec` (`@ebec/core` minor)

## Problem

Three libraries downstream of `@ebec/core` have independently grown a
carrier for validation issues on their error classes:

| Package | Dependencies | Carrier |
|---|---|---|
| `validup` | `@ebec/core`, `blemish` | consumes blemish; re-exports it for back-compat, slated for removal in v2 |
| `rapiq/core` | `@ebec/core`, `blemish` | `ParseError` gained an `issues` array in 2.2 |
| `@authup/errors` | `@ebec/core`, `validup` | `AuthupError.issues: Issue[]`, with `Issue` imported from validup |

Two costs follow from this.

`@authup/errors` depends on the whole of `validup` to obtain a single
type. And its `issues` is inert: `packages/errors/src/module.ts` assigns
`this.issues = []` unconditionally with no constructor path to populate
it, while `isAuthupError`'s slow path shape-checks
`Array.isArray(input.issues)`. Issues cannot be attached to an
`AuthupError` at all today.

Placing the property on `BaseError` removes the type-only dependency
and makes the carrier work by construction. It also matches what
consumers already chose: authup put `issues` on its own base class
rather than on a validation-specific subclass, so a dedicated
`ValidationError` in core would leave both authup and rapiq
re-declaring the property anyway.

## Prerequisite: dual-format blemish

`blemish` is ESM-only. Its `exports` map carries `types` and `import`
with no `require` condition. `@ebec/core` ships dual ESM + CJS, so even
a type-only `import type { Issue } from 'blemish'` lands in the emitted
`.d.cts` and fails to resolve for CJS consumers under `node16` /
`nodenext` resolution.

The failure is soft rather than hard. Most downstream tsconfigs set
`skipLibCheck: true`, which suppresses unresolved imports inside
declaration files — `Issue` silently widens to `any`. Consumers without
`skipLibCheck` get a real error. Both outcomes are wrong.

Three changes in the blemish repo, released as a patch:

- `tsdown.config.ts`: `format: 'esm'` becomes `format: ['esm', 'cjs']`
- `package.json` `exports["."]`: add
  `"require": { "types": "./dist/index.d.cts", "default": "./dist/index.cjs" }`
- `package.json` `main`: `dist/index.mjs` becomes `dist/index.cjs`, for
  legacy resolvers

This is a product decision for blemish, not only a mechanical one — its
ESM-only stance may have been deliberate. Nothing in its documented
portability claims (browsers, Deno, Bun, workers) conflicts with also
shipping CJS.

## `@ebec/core` changes

`blemish` enters `dependencies` and is imported type-only. No blemish
runtime function is called, so the import erases at build and the
package contributes zero runtime bytes.

### `src/options/types.ts`

Add to `ErrorOptions`:

```ts
/**
 * Structured validation failures, as a blemish issue tree.
 */
issues?: Issue[],
```

### `src/module.ts`

A required property, assigned unconditionally:

```ts
readonly issues: ReadonlyArray<Issue>;

// in the constructor, after the `errors` assignment:
this.issues = options.issues ? [...options.issues] : [];
```

Copied rather than aliased, matching how `errors` is handled.

The tree is stored as given. `Issue` is `IssueItem | IssueGroup`, and
group nodes are preserved intact — flattening is `flattenIssueItems`'
job at the consumer, and discarding grouping at the boundary would be
lossy.

### `toJSON()`

```ts
...(this.issues.length > 0 && { issues: [...this.issues] }),
```

Omitting the empty case is lossless, because the constructor's `[]`
default reconstitutes it on rehydration. Issues are plain data and
bypass `toSerializable`.

The declared return type gains `issues?: Issue[]`.

### `src/types.ts`

`IBaseError` gets `issues?: ReadonlyArray<Issue>` — optional, where the
class property is required.

This asymmetry is deliberate. `isBaseError` checks only `message` and
`code`, so a JSON-rehydrated error that omitted an empty `issues` would
otherwise be typed as carrying a property it does not have. Optional on
the duck-type interface, required on the class, is the sound split. A
class with a required member satisfies an interface with an optional
one.

### Deliberately excluded

**No `issues` validation in `isErrorOptions`.** That guard does not
validate `errors` either; checking one and not the other is arbitrary.

**No `isBaseErrorWithIssues` guard**, despite `isBaseErrorGroup`
suggesting the symmetry. Validating elements properly requires
blemish's `isIssue` at runtime, converting the types-only dependency
into a real one — for a guard with no caller inside ebec. Downstream
can keep its own `Array.isArray` check until there is a reason.

### `@ebec/http`

No source or `package.json` change. `HTTPErrorOptions` is
`ErrorOptions & {...}`, so `issues` flows through, and the emitted
types resolve `blemish` via `@ebec/core`'s own dependency.

## Testing

`errors` has its own `group.spec.ts`, so `issues` gets
`packages/core/test/unit/issues.spec.ts`:

- defaults to `[]` when no issues are passed
- populated from options
- stored as a copy — mutating the caller's array afterward does not
  reach the instance
- group nodes preserved intact rather than flattened
- `toJSON()` omits `issues` when empty
- `toJSON()` includes `issues` when non-empty
- `JSON.parse(JSON.stringify(err))` round-trip, including that the
  empty case rehydrates to `[]`

Plus one test in `packages/http` that `BadRequestError` carries and
serializes issues, since that is the inheritance path consumers will
use.

## Documentation

- `packages/core/README.md`: a "Validation Issues" section between
  "Error Grouping" and "Error Catalog"; rows in the `BaseError` and
  `ErrorOptions` API Reference tables; a note in "Serialization"
- `.agents/structure.md`: the "zero runtime deps" line becomes a
  types-only dependency on blemish
- `.agents/architecture.md`: the property in the BaseError Properties
  block, and the `toJSON()` shape in Serialization

## Release

1. blemish patch, published first
2. bump the `blemish` dependency in `@ebec/core`
3. land as a `feat:` commit; release-please cuts the minor

## Downstream migrations (out of scope, recorded for later)

`@authup/errors` and `rapiq/core` migrate separately, once the release
is on npm. Two notes for whoever does that work.

**The upgrade is non-breaking.** Both subclasses re-declare and assign
`issues`; `Issue[]` is assignable to `ReadonlyArray<Issue>`, so the
overrides stay compatible and the shadowing is harmless until they
migrate.

**`useDefineForClassFields` is a hazard for any subclass that
re-declares the property.** The target is ES2022, so the flag defaults
on: a re-declared `issues` without an initializer defines the field as
`undefined` on the instance and clobbers the base constructor's
assignment. Both current subclasses do assign, so neither is affected
today — but a subclass that drops its assignment while keeping the
declaration would silently break.

`AuthupError`'s assignment is the unconditional `this.issues = []`,
which means passing issues through authup keeps silently dropping them
until it migrates. That is the pre-existing bug carrying forward, not a
regression this change introduces.
