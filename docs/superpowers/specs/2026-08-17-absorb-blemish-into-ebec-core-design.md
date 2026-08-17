# Absorbing blemish into `@ebec/core`

**Date:** 2026-08-17
**Status:** Approved, not yet implemented
**Scope:** `tada5hi/ebec`, `tada5hi/validup`, `tada5hi/rapiq`, `tada5hi/blemish`
**Supersedes in part:** `2026-08-17-base-error-issues-design.md`, whose
types-only-dependency decision this reverses

## Problem

The `issues` property added by
`2026-08-17-base-error-issues-design.md` is a required member of every
`BaseError`, but its type comes from a package the consumer has to
install separately. `cause` is `unknown` and `errors` is `Error[]` —
both platform types. `issues` is the first property on the class whose
type the consumer cannot name, and whose values they cannot construct,
without a second dependency.

A type-only re-export from `@ebec/core` does not fix this. Of blemish's
public surface, only the type names erase; `IssueCode` is a runtime
const, and every factory, tree operation, guard and formatter is a
runtime value. A consumer with a type-only re-export could name an
issue but not build one, compare one against `IssueCode.REQUIRED`, or
flatten a tree.

## Decision

`@ebec/core` owns the failure vocabulary its errors carry. blemish's
model moves into `@ebec/core`, and the blemish package is retired.

The cost was measured before deciding, not assumed:

- **Bundle size is not the issue.** blemish minifies to 1.8 KB against
  `@ebec/core`'s 8.8 KB unminified, and it is pure functions in ESM, so
  it tree-shakes for consumers who never touch the helpers.
- **Dependency inversion is the real cost, and it is accepted.** Seven
  packages consume blemish today; only two of them (`validup` and
  `rapiq/core`) already depend on `@ebec/core`. The other five —
  `validup/validator-js`, `validup/zod`, `validup/standard-schema`,
  `validup/vue`, `rapiq/codec-url` — will newly depend on an
  error-class library to obtain a validation vocabulary. Four of those
  five need it at runtime; `validup/vue` uses types only. This is
  untidy, and it is the strongest argument against the decision. It was
  weighed explicitly and accepted: one model in one place is worth five
  new dependency edges among packages that share an owner.

## What moves

blemish's seven source files land under `packages/core/src/issue/`:
`check.ts`, `constants.ts`, `define.ts`, `flatten.ts`, `format.ts`,
`prefix.ts`, `types.ts`, plus a barrel `index.ts`. The layout is a 1:1
copy, so the archived blemish repo's history stays navigable against
it.

`packages/core/src/index.ts` gains one line:

```ts
export * from './issue';
```

### Export surface

Root export, not a subpath. The merge exists to remove the question
"which package do I import this from?"; a subpath would replace it with
"which specifier do I import this from?". A root export also keeps the
augmentation target a plain `declare module '@ebec/core'`, and avoids a
second augmentation target — augmenting the wrong one of two fails
silently, which is the type-identity failure mode already found once on
this branch.

The public surface grows by 25 names: 11 runtime exports (`IssueCode`,
`defineIssueItem`, `defineIssueGroup`, `flattenIssueItems`,
`flattenIssueGroups`, `formatIssue`, `interpolate`, `isIssue`,
`isIssueItem`, `isIssueGroup`, `prefixIssuePath`) and 15 type names, of
which `IssueCode` is both.

### The one collision resolves a fork

`interpolate` exists in both packages. blemish's copy documents itself
as inherited from `@ebec/core`, and the two implementations are
logically identical.

`issue/format.ts` imports `interpolate` from the existing
`helpers/interpolate.ts`, and blemish's copy is deleted. Its richer
JSDoc — the `g`-flag requirement and the `$`-pattern caveat on
substituted values — carries over to the surviving implementation.

The remaining 24 names do not collide with `@ebec/core`'s current
exports.

### Type imports become relative

The three `import type { Issue } from 'blemish'` sites — in
`module.ts`, `options/types.ts` and `types.ts` — become relative
imports from `./issue`. `blemish` leaves `@ebec/core`'s `dependencies`.

## What this reverses on the current branch

This work lands on PR #460 rather than after it, because it un-does
three things that branch currently does. Publishing them first would
mean releasing changes only to withdraw them.

- **`@ebec/http`'s `blemish` dependency is removed.** It was added to
  stop tsdown inlining blemish's declarations into http's published
  types. With the model inside `@ebec/core` — which `@ebec/http`
  already depends on — the inlining cannot occur, so the hazard is
  resolved structurally rather than by configuration.
- **Both READMEs revert to claiming zero runtime dependencies**, in
  `README.md` and `packages/core/README.md`, because the claim becomes
  true again. `.agents/structure.md`'s dependency-layer section reverts
  correspondingly.
- **The `exports`-map fix is unaffected** and stays. It was always an
  independent bug fix.

The existing review of PR #460 is stale for this enlarged scope. The
whole branch needs re-reviewing before merge.

## Downstream migrations

Six of the seven consuming packages are mechanical: swap the import
specifier, and add `@ebec/core` to `dependencies` where it is not
already there. `rapiq/core` already has it and needs only the swap;
the other five gain the dependency. `validup/validator-js` has five
import sites, `rapiq/core` has eight, and the rest have one or two.

| Package | Sites | Usage |
|---|---|---|
| `validup/validator-js` | 5 | `IssueCode` (runtime) |
| `validup/zod` | 1 | `defineIssueItem`, `isIssueItem` (runtime) |
| `validup/standard-schema` | 1 | `defineIssueItem` (runtime) |
| `validup/vue` | 1 | types only |
| `rapiq/codec-url` | 1 | `flattenIssueItems` (runtime) |
| `rapiq/core` | 8 | types, `flattenIssueItems`, `defineIssueItem` |

The seventh is `validup` itself, which additionally carries
`export * from 'blemish'` in `packages/validup/src/index.ts` — a
back-compat bridge for consumers who imported the issue model from
`validup` before it was extracted, with removal scheduled for v2.0.0 in
validup#466.

**That line is deleted rather than re-pointed, and `validup` goes to
v2.0.0.** It cannot become `export * from '@ebec/core'`, which would
leak `BaseError`, `defineErrorCatalog`, `markInstanceof` and the rest
of the error API into validup's surface. Re-pointing it at an explicit
list of issue names was considered and rejected: the bridge exists to
carry pre-extraction consumers to blemish, blemish is being retired, and
carrying them to a second destination only defers the same break.
Deleting it now closes validup#466.

Note for whoever does that work: the comment on that line cites
`scripts/verify-reexport.mjs` as guarding it, but no `scripts/`
directory exists in the validup repo — that protection is not currently
running.

`@authup/errors` is out of scope, as in the preceding spec.

## Retiring blemish

```
npm deprecate blemish "Moved into @ebec/core"
```

Then archive the GitHub repository. Versions 1.0.0 and 1.0.1 stay
published and keep working for anyone pinned to them; they simply stop
receiving changes. Archiving rather than deleting keeps the issue
history and the extraction rationale in its README readable.

No blemish 2.0 and no re-export shim. A shim would invert the
dependency — a zero-dependency model package depending on an error
library — and leave two import paths for one model indefinitely, which
is the ambiguity this change exists to remove.

## Sequencing

Ordered by what must exist on npm before the next stage can install it,
and by when the deprecation notice becomes useful rather than noisy.

1. **ebec** — absorb onto PR #460, re-review the whole branch, merge,
   release `@ebec/core` as a minor. `@ebec/http` takes a patch for the
   dependency removal.
2. **validup** — migrate all five packages, delete the re-export,
   release v2.0.0, close validup#466.
3. **rapiq** — migrate `core` and `codec-url`, release both as minors.
4. **blemish** — deprecate and archive.

Stages 2 and 3 are independent and may run in either order.

Retirement is last, not second. Deprecating blemish while `validup` and
`rapiq` still depend on it would print a deprecation warning on every
install of those packages, for a transitive dependency the installer
cannot act on.

## Testing

`@ebec/core` ends with 214 tests — its existing 124 plus blemish's 90,
which move to `packages/core/test/unit/issue/`. Coverage thresholds in
`packages/core/test/vitest.config.ts` need re-baselining upward;
blemish's suite is dense relative to its source.

`validup` and `rapiq` must pass their existing suites unchanged after
the specifier swap. A test that breaks means the absorption changed
behaviour, and is a defect rather than an expected migration cost.

The single behavioural risk is the `interpolate` de-duplication.
blemish's `format.ts` tests are the regression net for it, and they
move across with the rest.

## Known risk: the dual-model window

Between stage 1 and stages 2–3, a project depending on both
`@ebec/core` and an unmigrated `validup` or `rapiq` has two `Issue`
type identities in its dependency tree. They are structurally
compatible, and blemish's guards are duck-typed by design, so runtime
behaviour and ordinary type-checking are unaffected. A
`declare module` augmentation of `IssueDataByCode` would reach only one
of them.

Keeping that window short is the reason for the strict ordering. It is
not otherwise mitigated.
