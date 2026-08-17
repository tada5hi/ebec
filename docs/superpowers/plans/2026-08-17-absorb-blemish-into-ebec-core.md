# Absorbing blemish into `@ebec/core` — Implementation Plan

> **Status: Executed — historical record, not live instructions.** Implemented
> by commits `0a761da`, `40aff04`, `0aeb9e9` on `feat/base-error-issues`
> (stage 1 of the spec; stages 2-4 are out of scope for this repo, see below).

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Move blemish's issue model into `@ebec/core`, so a consumer needs one install to name, build and consume the `issues` property that `BaseError` already requires.

**Architecture:** blemish's seven source files are copied verbatim into `packages/core/src/issue/` — every internal import is directory-relative and survives unchanged. The single collision, `interpolate`, is resolved by deleting blemish's copy and importing `@ebec/core`'s existing one, which blemish's own JSDoc names as the original. The model is exported from the package root, `BaseError`'s type imports become relative, and `blemish` leaves both packages' `dependencies`.

**Tech Stack:** TypeScript (ES2022, `verbatimModuleSyntax`), tsdown (rolldown), Vitest 4, npm workspaces, release-please.

**Spec:** `docs/superpowers/specs/2026-08-17-absorb-blemish-into-ebec-core-design.md`

## Scope of this plan

This plan covers **stage 1 only** — the ebec absorption. The spec's stages 2-4 (migrating `validup`, migrating `rapiq`, then deprecating and archiving blemish) cannot begin until `@ebec/core` is published to npm with the model, which requires merging PR #460 and its release-please PR. They get their own plan once that release lands.

## Global Constraints

- Work happens on branch `feat/base-error-issues` in `/opt/projects/tada5hi/ebec`, which is PR #460. Do not create a new branch.
- Source repository for the copied files: `/opt/projects/tada5hi/blemish` (present locally, on `master`). **Read-only** — this plan makes no changes there.
- Conventional Commits enforced by commitlint + husky. Do **not** add a `Co-Authored-By` or any AI-attribution trailer to commit messages.
- `verbatimModuleSyntax: true` — every type import must use `import type`.
- Copied files keep their existing copyright headers verbatim.
- After this plan, `grep -rn "blemish" packages/*/src packages/*/package.json` must return **nothing**. `blemish` is gone from the repo as a dependency and as an import specifier.
- The `exports`-map shape established by commit `9b40eac` (nested `types` inside `import`/`require`) must not be disturbed.
- Run npm commands from the repo root `/opt/projects/tada5hi/ebec`.

---

### Task 1: Absorb the issue model and its tests

**Files:**
- Create: `packages/core/src/issue/check.ts`, `constants.ts`, `define.ts`, `flatten.ts`, `format.ts`, `index.ts`, `prefix.ts`, `types.ts` (copied)
- Create: `packages/core/test/unit/issue/check.spec.ts`, `constants.spec.ts`, `define.spec.ts`, `flatten.spec.ts`, `format.spec.ts`, `prefix.spec.ts` (copied)
- Modify: `packages/core/src/index.ts`
- Modify: `packages/core/test/vitest.config.ts`

**Interfaces:**
- Consumes: nothing from earlier tasks.
- Produces: `@ebec/core` root exports gain 11 runtime names (`IssueCode`, `defineIssueItem`, `defineIssueGroup`, `flattenIssueItems`, `flattenIssueGroups`, `formatIssue`, `isIssue`, `isIssueItem`, `isIssueGroup`, `prefixIssuePath`, and the pre-existing `interpolate`) plus 15 type names including `Issue`, `IssueItem`, `IssueGroup`, `IssueDataByCode`. Task 2 imports `Issue` from `./issue`.

- [ ] **Step 1: Copy the source files**

```bash
cd /opt/projects/tada5hi/ebec
mkdir -p packages/core/src/issue
cp /opt/projects/tada5hi/blemish/src/{check,constants,define,flatten,format,index,prefix,types}.ts packages/core/src/issue/
```

Every internal import in these files is directory-relative (`./constants`, `./types`, `./check`), so they resolve unchanged in their new home. Do not edit them yet.

- [ ] **Step 2: Resolve the `interpolate` collision**

`packages/core/src/issue/format.ts` defines its own `interpolate`, which would collide with the one already exported from `packages/core/src/helpers/interpolate.ts` and make `export * from './issue'` an ambiguous star export.

In `packages/core/src/issue/format.ts`, replace the import block:

```ts
import type { IssueCode } from './constants';
import type { Issue } from './types';
```

with:

```ts
import { interpolate } from '../helpers/interpolate';
import type { IssueCode } from './constants';
import type { Issue } from './types';
```

Then delete the entire local `export function interpolate(...)` declaration from that file, **but first move its JSDoc block onto the surviving implementation** in `packages/core/src/helpers/interpolate.ts`. That JSDoc documents two real behaviours the existing copy has but does not describe: that a custom `regex` must carry the `g` flag (`String.prototype.matchAll` throws without it), and that `$&`, `` $` ``, `$'` and `$1` inside a *substituted value* are interpreted as replacement patterns rather than literals, so `data` values must be trusted or `$`-escaped.

Drop the sentence "Two properties are inherited from the `@ebec/core` implementation this replaces, and are kept deliberately so that libraries which re-export either function stay behaviourally identical" — after the merge there is no other implementation for it to refer to. Keep the two bullet points it introduces.

`formatIssue` in the same file continues to call `interpolate(template, issue.data || {})` unchanged; it now resolves to the imported one.

- [ ] **Step 3: Wire the root export**

In `packages/core/src/index.ts`, add `./issue` to the barrel. Place it last so the diff is minimal:

```ts
export * from './types';
export * from './module';
export * from './options';
export * from './helpers';
export * from './catalog';
export * from './issue';
```

- [ ] **Step 4: Copy the tests and repoint their imports**

```bash
cd /opt/projects/tada5hi/ebec
mkdir -p packages/core/test/unit/issue
cp /opt/projects/tada5hi/blemish/test/unit/{check,constants,define,flatten,format,prefix}.spec.ts packages/core/test/unit/issue/
```

Each copied spec imports from `'../../src'`. From `test/unit/issue/` that path must become `'../../../src'` — one level deeper. Update every occurrence in all six files:

```bash
cd /opt/projects/tada5hi/ebec
sed -i '' "s|from '\.\./\.\./src'|from '../../../src'|g" packages/core/test/unit/issue/*.spec.ts
grep -rn "from '\.\./\.\./\.\./src'" packages/core/test/unit/issue/ | wc -l
```

Expected: a non-zero count, and `grep -rn "from '\.\./\.\./src'" packages/core/test/unit/issue/` returns nothing.

Note the `sed -i ''` form — this is macOS/BSD sed. On GNU sed use `sed -i` without the empty argument.

- [ ] **Step 5: Preserve blemish's 100% coverage contract**

blemish enforced 100% coverage across all four metrics, with a documented rationale: the package is pure functions with no engine, no I/O and no framework, so nothing in it is legitimately hard to reach. `@ebec/core`'s thresholds are far lower (branches 59, functions 77, lines 73, statements 74) because it covers a different kind of code.

Merging the suites under one config would silently drop that guarantee. Keep both, using vitest's per-glob thresholds. Replace the `thresholds` block in `packages/core/test/vitest.config.ts`:

```ts
            thresholds: {
                branches: 59,
                functions: 77,
                lines: 73,
                statements: 74,
                // The absorbed issue model keeps the 100% contract it was
                // written under: pure functions, no engine, no I/O, no
                // framework — nothing here is legitimately hard to reach,
                // so treat a drop as a real gap rather than re-baselining.
                //
                // This measures only the runtime surface. A large share of
                // what the model is lives in the type system, which coverage
                // cannot see; `npm run build:types` is the other half.
                '**/src/issue/**': {
                    branches: 100,
                    functions: 100,
                    lines: 100,
                    statements: 100,
                },
            },
```

- [ ] **Step 6: Run the tests**

Run: `cd /opt/projects/tada5hi/ebec && npm run test -w packages/core`
Expected: PASS, 180 tests — `@ebec/core`'s existing 90 plus blemish's 90. All six new spec files must appear in the run; a suite that silently does not execute is a failure even though the count still looks plausible.

If a copied spec fails, the most likely cause is the `interpolate` edit in Step 2 — check `format.spec.ts` first, since it is the only suite that exercises the de-duplicated function.

- [ ] **Step 7: Verify coverage thresholds hold**

Run: `cd /opt/projects/tada5hi/ebec && npm run test:coverage -w packages/core`
Expected: PASS. `src/issue/**` reports 100% on all four metrics; the package overall clears its existing thresholds.

If the glob thresholds do not apply as expected, vitest may be excluding globbed files from the global thresholds — confirm the reported numbers rather than assuming, and report what you observe.

- [ ] **Step 8: Verify the build and the export surface**

Run: `cd /opt/projects/tada5hi/ebec && npm run build -w packages/core && npm run lint`
Expected: both succeed. In particular the build must not warn about an ambiguous or duplicate `interpolate` export — if it does, Step 2 was not completed.

Confirm the merged surface:

```bash
cd /opt/projects/tada5hi/ebec
node -e "const c = require('./packages/core/dist/index.cjs'); const k = Object.keys(c).sort(); console.log(k.length, k.join(', '));"
```

Expected: includes `BaseError`, `IssueCode`, `defineIssueItem`, `defineIssueGroup`, `flattenIssueItems`, `flattenIssueGroups`, `formatIssue`, `isIssue`, `isIssueItem`, `isIssueGroup`, `prefixIssuePath`, and exactly one `interpolate`.

- [ ] **Step 9: Commit**

```bash
cd /opt/projects/tada5hi/ebec
git add packages/core/src/issue packages/core/test/unit/issue packages/core/src/index.ts packages/core/src/helpers/interpolate.ts packages/core/test/vitest.config.ts
git commit -m "feat(core): absorb the blemish issue model"
```

---

### Task 2: Point `BaseError` at the internal model and drop both blemish dependencies

**Files:**
- Modify: `packages/core/src/module.ts`
- Modify: `packages/core/src/types.ts`
- Modify: `packages/core/src/options/types.ts`
- Modify: `packages/core/package.json`
- Modify: `packages/http/package.json`

**Interfaces:**
- Consumes: `Issue` from `packages/core/src/issue`, established by Task 1.
- Produces: an `@ebec/core` and `@ebec/http` with no `blemish` entry in `dependencies` and no `blemish` import specifier anywhere in `src/`.

- [ ] **Step 1: Repoint the three type imports**

Three files currently read `import type { Issue } from 'blemish';`. Change each to a relative import.

In `packages/core/src/module.ts` and `packages/core/src/types.ts`:

```ts
import type { Issue } from './issue';
```

In `packages/core/src/options/types.ts`:

```ts
import type { Issue } from '../issue';
```

- [ ] **Step 2: Repoint the http test's imports — before removing the dependency**

`packages/http/test/unit/issues.spec.ts` currently opens with:

```ts
import { IssueCode, defineIssueItem } from 'blemish';
```

Change it to source both from the package that now owns them:

```ts
import { IssueCode, defineIssueItem } from '@ebec/core';
```

Do this **before** Step 3. `@ebec/http` has `blemish` as a devDependency purely so this spec could call the factories; uninstalling it first would break the suite in between steps.

- [ ] **Step 3: Remove the dependency from both packages**

Run:

```bash
cd /opt/projects/tada5hi/ebec
npm uninstall blemish -w packages/core
npm uninstall blemish -w packages/http
```

`packages/core/package.json` will be left with an empty `dependencies` object or none at all — either is fine, but if npm leaves `"dependencies": {}` behind, delete the empty key so the manifest stays clean. `packages/http/package.json` must keep `"@ebec/core"` and lose only `blemish`.

- [ ] **Step 4: Verify no trace of blemish remains in the source**

Run:

```bash
cd /opt/projects/tada5hi/ebec
grep -rn "blemish" packages/*/src packages/*/package.json packages/*/test || echo "CLEAN: no blemish references"
```

Expected: `CLEAN: no blemish references`.

If `packages/core/test/unit/issue/*.spec.ts` still mentions blemish, a copied spec has a stale comment — edit it rather than leaving a reference to a package this repo no longer uses.

- [ ] **Step 5: Rebuild and verify the artifacts**

Run: `cd /opt/projects/tada5hi/ebec && npm run build`
Expected: both packages build.

Then confirm the two defects this absorption is meant to resolve structurally are gone:

```bash
cd /opt/projects/tada5hi/ebec
echo "--- no blemish import in any declaration file ---"
grep -l "blemish" packages/*/dist/*.d.* 2>/dev/null || echo "none"
echo "--- no inlined blemish region in http ---"
grep -c "region.*blemish" packages/http/dist/index.d.mts 2>/dev/null || echo "0"
echo "--- Issue is defined locally in core's declarations ---"
grep -n "interface Issue\|type Issue " packages/core/dist/index.d.mts | head -3
```

Expected: `none` for the first check, `0` for the second, and `Issue` appearing as a locally-declared type in core's `.d.mts` rather than an import.

This is the pay-off: `@ebec/http` previously needed `blemish` in `dependencies` purely to stop tsdown inlining its declarations. With the model inside `@ebec/core` — which `@ebec/http` already depends on — the inlining cannot occur at all.

- [ ] **Step 6: Run the full suite**

Run: `cd /opt/projects/tada5hi/ebec && npm run test && npm run lint`
Expected: all pass, 214 tests (180 core + 34 http). The http suite exercises the inheritance path that matters most here: `BadRequestError` carrying and serializing issues whose type now originates inside `@ebec/core` rather than an external package.

- [ ] **Step 7: Commit**

```bash
cd /opt/projects/tada5hi/ebec
git add packages/core/src packages/core/package.json packages/http/package.json packages/http/test package-lock.json
git commit -m "refactor(core): source the issue model internally and drop the blemish dependency"
```

---

### Task 3: Documentation

**Files:**
- Modify: `README.md`
- Modify: `packages/core/README.md`
- Modify: `.agents/structure.md`
- Modify: `.agents/architecture.md`

**Interfaces:**
- Consumes: everything from Tasks 1 and 2.
- Produces: nothing code-facing.

- [ ] **Step 1: Restore the zero-dependency claim in both READMEs**

Earlier on this branch, two READMEs were changed away from claiming zero runtime dependencies, because `@ebec/core` had taken `blemish` as a types-only dependency. After Task 2 that dependency is gone and the original claim is true again.

In `README.md`, the `### @ebec/core` blurb currently ends:

> Base error class with automatic code derivation, message interpolation, error catalogs, and JSON serialization. One types-only dependency (`blemish`) — nothing from it is imported at runtime, so it adds no bytes to your bundle.

Replace that trailing sentence with `Zero runtime dependencies.`

In `packages/core/README.md`, the tagline currently ends:

> Core error class library for TypeScript. Provides `BaseError` with automatic code derivation, message interpolation, and JSON serialization. One types-only dependency (`blemish`) — nothing from it is imported at runtime, so it adds no bytes to your bundle.

Replace that trailing sentence with `Zero runtime dependencies.`

- [ ] **Step 2: Update the README's Validation Issues section**

The section added earlier on this branch tells the reader to install and import from `blemish`. Rewrite those references to `@ebec/core`. Specifically:

- The import line in the first example becomes a single import: `import { BaseError, IssueCode, defineIssueItem } from '@ebec/core';`
- The `flattenIssueItems` example imports from `'@ebec/core'` rather than `'blemish'`. Keep the `[...error.issues]` spread — `flattenIssueItems` takes a mutable `Issue[]` and `error.issues` is a `ReadonlyArray<Issue>`, so the spread is still required.
- Delete the closing paragraph beginning "blemish is a **types-only** dependency of this package" entirely. It describes an arrangement that no longer exists.
- Replace the link to `https://github.com/tada5hi/blemish` with plain prose describing the model, since that repository is being archived.

Add a sentence noting the model is exported from the package root, so `defineIssueItem`, `flattenIssueItems`, `formatIssue`, `IssueCode` and the `Issue` types all come from `@ebec/core` directly.

- [ ] **Step 3: Update the API Reference tables**

In `packages/core/README.md`'s API Reference, add the issue model's exports so the merged surface is documented. Add a `### Issue Model` subsection after `### Helpers`, with two tables.

Functions:

| Function | Description |
|----------|-------------|
| `defineIssueItem(input)` | Build a leaf issue. The supplied `code` selects the required `data` shape at compile time. |
| `defineIssueGroup(input)` | Build an issue with children. Does not rewrite child paths — that is `prefixIssuePath`'s job. |
| `prefixIssuePath(issue, prefix)` | Rebase an issue onto a parent path, recursing into groups. Returns copies. |
| `flattenIssueItems(issues)` | Every leaf, pre-order, grouping discarded. Returns live references. |
| `flattenIssueGroups(issues)` | Every group, pre-order, outermost first. Returns live references. |
| `formatIssue(issue, templates?, fallback?)` | Render a message: template → eager `message` → fallback. |
| `isIssueItem(input)` | Structural check for a leaf. |
| `isIssueGroup(input)` | Structural check for an issue with children; recurses. |
| `isIssue(input)` | Either of the above. |

Types: `Issue`, `IssueItem`, `IssueGroup`, `IssueBase`, `IssueItemTyped`, `IssueItemBare`, `IssueItemRaw`, `IssueCode`, `IssueDataByCode`, `ParameterizedIssueCode`, `BareIssueCode`, `IssueMessageTemplates`, `ResolveIssueCode`.

Note in prose that `IssueCode` is a default vocabulary rather than a requirement — `IssueItem['code']` is widened to `IssueCode | (string & {})`, so any string is a well-formed code — and that `IssueDataByCode` is augmentable via `declare module '@ebec/core'` to add typed `data` shapes for your own codes.

- [ ] **Step 4: Correct the dependency layer in `.agents/structure.md`**

The `## Dependency Layer` section currently reads:

```
@ebec/http  →  @ebec/core  →  blemish (types only)
```

with a paragraph describing the types-only arrangement. Replace both with:

````markdown
```
@ebec/http  →  @ebec/core  →  (no runtime deps)
```

`@ebec/core` (packages/core) is the canonical implementation, with zero runtime dependencies. It owns both the error classes and the issue model that `BaseError.issues` carries — the latter absorbed from the `blemish` package, which it replaces. `@ebec/http` depends on `@ebec/core`.
````

- [ ] **Step 5: Add the issue model to the structure map**

In the same file's Monorepo Layout tree, add the new directory under `packages/core/src/`, after the `options/` entry and before `helpers/`:

```
│   │   │   ├── issue/         # Issue tree model (absorbed from blemish)
│   │   │   │   ├── check.ts       # isIssue(), isIssueItem(), isIssueGroup()
│   │   │   │   ├── constants.ts   # IssueCode vocabulary
│   │   │   │   ├── define.ts      # defineIssueItem(), defineIssueGroup()
│   │   │   │   ├── flatten.ts     # flattenIssueItems(), flattenIssueGroups()
│   │   │   │   ├── format.ts      # formatIssue()
│   │   │   │   ├── prefix.ts      # prefixIssuePath()
│   │   │   │   └── types.ts       # Issue, IssueItem, IssueGroup
```

- [ ] **Step 6: Note the model in `.agents/architecture.md`**

After the `## BaseError Properties` section's `### Serialization` subsection, add a short `## Issue Model` section:

````markdown
## Issue Model

`@ebec/core` owns the issue-tree model that `BaseError.issues` carries, absorbed from the `blemish` package it replaces. An issue is either an **item** (a leaf) or a **group** (a node with children), and every node carries its **absolute path** from the root of the validated structure — a leaf three groups deep still reads `['user', 'contact', 'email']`, never `['email']` relative to its parent.

That invariant is maintained by the producer, not automatically. A library validating a sub-structure and merging the results into a parent tree must rebase the children as it merges; `prefixIssuePath(issue, prefix)` is that step, and it recurses into groups so nested leaves are rebased too.

Build issues with the factories (`defineIssueItem`, `defineIssueGroup`) rather than object literals — the factories apply the compile-time `data` gatekeep that makes a translation catalog safe to write. The guards are duck-typed rather than `instanceof`-based, deliberately: a tree assembled across package or realm boundaries has no shared class to check against.
````

- [ ] **Step 7: Verify**

Run: `cd /opt/projects/tada5hi/ebec && npm run test && npm run lint && npm run build`
Expected: all pass.

Then confirm no documentation still points at the retired package:

```bash
cd /opt/projects/tada5hi/ebec
grep -rn "blemish" README.md packages/*/README.md .agents/ | grep -v "absorbed from\|which it replaces\|replaces the" || echo "CLEAN"
```

Expected: `CLEAN`, or only the historical mentions that deliberately name blemish as the package this model came from.

- [ ] **Step 8: Commit**

```bash
cd /opt/projects/tada5hi/ebec
git add README.md packages/core/README.md .agents/structure.md .agents/architecture.md
git commit -m "docs: document the absorbed issue model"
```

---

## Follow-on work (not this plan)

Once PR #460 merges and `@ebec/core` publishes:

1. **validup** — migrate five packages off `blemish`, delete the `export * from 'blemish'` back-compat line, release v2.0.0, close validup#466.
2. **rapiq** — migrate `core` and `codec-url`, release both as minors.
3. **blemish** — `npm deprecate blemish "Moved into @ebec/core"`, archive the repository.

Retirement is last so that deprecation warnings do not appear on installs of validup and rapiq while they still depend on it.
