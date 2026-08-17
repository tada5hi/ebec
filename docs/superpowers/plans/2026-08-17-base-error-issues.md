# `BaseError.issues` Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Give `@ebec/core`'s `BaseError` an `issues` property carrying a blemish issue tree, so downstream libraries stop each declaring their own.

**Architecture:** `blemish` gets a dual-format (ESM + CJS) patch release so its types resolve for CJS consumers. `@ebec/core` then takes `blemish` as a **types-only** dependency — `import type` only, no runtime function called, zero runtime bytes added — and gains a required `readonly issues: ReadonlyArray<Issue>` property that defaults to `[]` and serializes only when non-empty. `@ebec/http` needs no source change; `issues` flows through `HTTPErrorOptions` and `HTTPError.toJSON()`'s `super.toJSON()` spread.

**Tech Stack:** TypeScript (ES2022, `verbatimModuleSyntax`), tsdown (rolldown), Vitest 4, npm workspaces, release-please.

**Spec:** `docs/superpowers/specs/2026-08-17-base-error-issues-design.md`

## Global Constraints

- Two repositories: `/opt/projects/tada5hi/blemish` (Task 1 only) and `/opt/projects/tada5hi/ebec` (Tasks 2-5).
- ebec work happens on branch `feat/base-error-issues`, already created off `master`.
- Conventional Commits are enforced by commitlint + husky in **both** repos.
- **Do not** add a `Co-Authored-By` or any AI-attribution trailer to commit messages.
- `verbatimModuleSyntax: true` — every type import must use `import type`.
- `blemish` must remain a **types-only** dependency of `@ebec/core`. Never import a blemish value (`defineIssueItem`, `isIssue`, `flattenIssueItems`, …) into `packages/core/src/**`. Test files may import values freely.
- Do **not** add `issues` validation to `isErrorOptions`, and do **not** add an `isBaseErrorWithIssues` guard. Both are deliberate exclusions — see the spec.
- Node.js >= 22, npm workspaces. Run ebec commands from the repo root.

---

### Task 1: Dual-format blemish

**Repository:** `/opt/projects/tada5hi/blemish` (NOT the ebec repo)

**Files:**
- Modify: `tsdown.config.ts`
- Modify: `package.json`

**Interfaces:**
- Consumes: nothing.
- Produces: a `blemish` package whose `exports["."]` resolves under both `import` and `require`, shipping `dist/index.mjs`, `dist/index.cjs`, `dist/index.d.mts`, `dist/index.d.cts`. Task 2 depends on this being published as `1.0.1`.

This task has no unit test — the deliverable is a package resolution shape, so the verification is an artifact check rather than a red-green cycle. Steps 4 and 5 are that check.

- [ ] **Step 1: Switch the build to dual format**

In `/opt/projects/tada5hi/blemish/tsdown.config.ts`, change the `format` line only. Leave the `tsconfig` option and its comment untouched.

```ts
import { defineConfig } from 'tsdown';

export default defineConfig({
    entry: 'src/index.ts',
    format: ['esm', 'cjs'],
    dts: true,
    sourcemap: true,
    // `tsconfig.json` additionally includes `test/**/*` so `npm run build:types`
    // checks the specs — in particular the `@ts-expect-error` cases pinning
    // `defineIssueItem`'s per-code `data` gatekeep, which are inert unless a
    // `tsc` run covers them. Emission reads the src-only config so specs can
    // never influence the published `.d.mts`.
    tsconfig: 'tsconfig.build.json',
});
```

- [ ] **Step 2: Declare the `require` condition**

In `/opt/projects/tada5hi/blemish/package.json`, replace the `main` and `exports` fields:

```json
    "main": "dist/index.cjs",
    "types": "dist/index.d.mts",
    "exports": {
        "./package.json": "./package.json",
        ".": {
            "import": {
                "types": "./dist/index.d.mts",
                "default": "./dist/index.mjs"
            },
            "require": {
                "types": "./dist/index.d.cts",
                "default": "./dist/index.cjs"
            }
        }
    },
```

Note this nests `types` inside each condition rather than hoisting one `types` above both, which is what the spec's prose described. Same outcome, and the nested form is the shape that makes per-format declaration files unambiguous — a hoisted `types` pointing at `.d.mts` would hand ESM declarations to CJS consumers.

`main` moves to the `.cjs` file because legacy resolvers that ignore `exports` are exactly the CJS ones.

- [ ] **Step 3: Build**

Run: `cd /opt/projects/tada5hi/blemish && npm run build`
Expected: completes without errors.

- [ ] **Step 4: Verify the artifacts exist and the CJS entry actually loads**

Run:
```bash
cd /opt/projects/tada5hi/blemish
ls dist/index.mjs dist/index.cjs dist/index.d.mts dist/index.d.cts
node -e "const b = require('./dist/index.cjs'); console.log(typeof b.defineIssueItem, typeof b.flattenIssueItems)"
```
Expected: all four files listed, then `function function`.

- [ ] **Step 5: Verify the published resolution shape**

Run: `cd /opt/projects/tada5hi/blemish && npx --yes @arethetypeswrong/cli@latest --pack .`
Expected: no `Masquerading as ESM`, no `No types` and no `Missing export condition` problems for `node10`, `node16 (from CJS)`, `node16 (from ESM)` or `bundler`.

If it reports `CJS default export` interop notes, those are informational for a namespace-only package and can be ignored. Any row reporting a **resolution failure** must be fixed before moving on.

- [ ] **Step 6: Run the existing test suite**

Run: `cd /opt/projects/tada5hi/blemish && npm run test && npm run lint`
Expected: all pass. Nothing in `src/` changed, so this is a guard against a build-config typo.

- [ ] **Step 7: Commit**

The `fix:` prefix is required — release-please only cuts a release for `feat:` and `fix:`, and a `build:` prefix would leave `1.0.1` unpublished, blocking Task 2.

```bash
cd /opt/projects/tada5hi/blemish
git add tsdown.config.ts package.json
git commit -m "fix: ship dual esm + cjs output so types resolve from cjs consumers"
```

---

## Release gate (between Task 1 and Task 2)

Task 2 installs `blemish@^1.0.1`, which must exist on npm first. Push Task 1's commit, let release-please open its PR, merge it, and confirm the release workflow published `1.0.1`:

```bash
npm view blemish@1.0.1 version
```

**If you need to start Task 2 before that lands**, `npm link` the local build instead, and remember to swap it for the registry version before Task 5's final verification:

```bash
cd /opt/projects/tada5hi/blemish && npm link
cd /opt/projects/tada5hi/ebec && npm link blemish
```

---

### Task 2: `issues` on `ErrorOptions` and `BaseError`

**Repository:** `/opt/projects/tada5hi/ebec`

**Files:**
- Modify: `packages/core/package.json`
- Modify: `packages/core/src/options/types.ts`
- Modify: `packages/core/src/module.ts:21-78`
- Test: `packages/core/test/unit/issues.spec.ts` (create)

**Interfaces:**
- Consumes: `Issue`, `IssueCode`, `defineIssueItem`, `defineIssueGroup` from `blemish`.
- Produces: `ErrorOptions['issues']` typed `Issue[] | undefined`, and `BaseError#issues` typed `ReadonlyArray<Issue>` — **required, never undefined**, defaulting to `[]`. Tasks 3 and 4 rely on both the property name and its always-an-array guarantee.

- [ ] **Step 1: Add the dependency**

Run: `cd /opt/projects/tada5hi/ebec && npm install blemish@^1.0.1 -w packages/core`

`packages/core/package.json` currently has no `dependencies` field at all. Confirm npm inserted one and that it sits before `publishConfig`:

```json
    "dependencies": {
        "blemish": "^1.0.1"
    },
    "publishConfig": {
        "access": "public"
    }
```

- [ ] **Step 2: Write the failing tests**

Create `packages/core/test/unit/issues.spec.ts`:

```ts
import { IssueCode, defineIssueGroup, defineIssueItem } from 'blemish';
import { describe, expect, it } from 'vitest';
import { BaseError } from '../../src';

function requiredIssue() {
    return defineIssueItem({
        code: IssueCode.REQUIRED,
        path: ['user', 'name'],
        message: 'Name is required',
    });
}

function emailIssue() {
    return defineIssueItem({
        code: IssueCode.EMAIL,
        path: ['user', 'contact', 'email'],
        message: 'Not a valid email address',
    });
}

describe('issues', () => {
    it('should default issues to an empty array', () => {
        const error = new BaseError('simple');

        expect(error.issues).toEqual([]);
    });

    it('should create instance with issues option', () => {
        const issue = requiredIssue();
        const error = new BaseError({ message: 'validation failed', issues: [issue] });

        expect(error.issues).toEqual([issue]);
    });

    it('should copy the issues array instead of aliasing it', () => {
        const issues = [requiredIssue()];
        const error = new BaseError({ issues });

        issues.push(emailIssue());

        expect(error.issues).toHaveLength(1);
    });

    it('should preserve group nodes instead of flattening them', () => {
        const group = defineIssueGroup({
            code: IssueCode.ONE_OF_FAILED,
            path: ['user', 'contact'],
            message: 'No contact method was valid',
            issues: [emailIssue()],
        });
        const error = new BaseError({ issues: [group] });

        expect(error.issues).toHaveLength(1);
        expect(error.issues[0]).toBe(group);
    });
});
```

- [ ] **Step 3: Run the tests to verify they fail**

Run: `cd /opt/projects/tada5hi/ebec && npm run test -w packages/core -- issues.spec.ts`
Expected: FAIL. The `issues` option is not in `ErrorOptions`, so `error.issues` is `undefined` and every assertion misses.

- [ ] **Step 4: Add the option**

In `packages/core/src/options/types.ts`, add the import at the top of the file and the property at the end of the `ErrorOptions` type, after `errors`:

```ts
import type { Issue } from 'blemish';
```

```ts
    /**
     * Structured validation failures, as a blemish issue tree.
     *
     * Stored as given — group nodes keep their children, since flattening
     * is `flattenIssueItems`' job at the consumer.
     */
    issues?: Issue[],
```

- [ ] **Step 5: Add the property and assign it**

In `packages/core/src/module.ts`, add the type import alongside the existing imports:

```ts
import type { Issue } from 'blemish';
```

Declare the property immediately after `errors`:

```ts
    /**
     * Structured validation failures, as a blemish issue tree.
     * Always an array — empty when the error carries none.
     */
    readonly issues: ReadonlyArray<Issue>;
```

And assign it in the constructor, between the `errors` block and the `markInstanceof` call:

```ts
        this.issues = options.issues ? [...options.issues] : [];
```

Unlike `errors`, this assignment is unconditional — the property is required and defaults to an empty array.

- [ ] **Step 6: Run the tests to verify they pass**

Run: `cd /opt/projects/tada5hi/ebec && npm run test -w packages/core -- issues.spec.ts`
Expected: PASS, 4 tests.

- [ ] **Step 7: Run the full core suite and the linter**

Run: `cd /opt/projects/tada5hi/ebec && npm run test -w packages/core && npm run lint`
Expected: all pass. Coverage thresholds (branches 59, functions 77, lines 73, statements 74) still met.

- [ ] **Step 8: Commit**

```bash
cd /opt/projects/tada5hi/ebec
git add packages/core/package.json packages/core/src/options/types.ts packages/core/src/module.ts packages/core/test/unit/issues.spec.ts package-lock.json
git commit -m "feat(core): add issues property to BaseError"
```

---

### Task 3: Serialize `issues` in `toJSON()`

**Repository:** `/opt/projects/tada5hi/ebec`

**Files:**
- Modify: `packages/core/src/module.ts:86-102`
- Test: `packages/core/test/unit/issues.spec.ts` (append)

**Interfaces:**
- Consumes: `BaseError#issues` from Task 2.
- Produces: `BaseError#toJSON()` returning an optional `issues?: Issue[]` key, present only when the array is non-empty. Task 4's HTTP guard relies on this flowing through `super.toJSON()`.

- [ ] **Step 1: Write the failing tests**

Append to `packages/core/test/unit/issues.spec.ts`, inside the existing `describe('issues', ...)` block:

```ts
    it('should omit issues from toJSON when empty', () => {
        const error = new BaseError('simple');

        expect(error.toJSON()).not.toHaveProperty('issues');
    });

    it('should include issues in toJSON when present', () => {
        const issue = requiredIssue();
        const error = new BaseError({ message: 'validation failed', issues: [issue] });

        expect(error.toJSON().issues).toEqual([issue]);
    });

    it('should survive a JSON round-trip', () => {
        const error = new BaseError({ message: 'validation failed', issues: [requiredIssue()] });
        const output = JSON.parse(JSON.stringify(error));

        expect(output.issues).toHaveLength(1);
        expect(output.issues[0].code).toEqual(IssueCode.REQUIRED);
        expect(output.issues[0].path).toEqual(['user', 'name']);
        expect(output.issues[0].message).toEqual('Name is required');
    });

    it('should rehydrate an omitted issues key to an empty array', () => {
        const error = new BaseError('simple');
        const output = JSON.parse(JSON.stringify(error));

        expect(output.issues).toBeUndefined();
        expect(new BaseError(output).issues).toEqual([]);
    });
```

The last test is the one that makes omitting-when-empty lossless: the key is absent on the wire, and the constructor's default puts it back.

- [ ] **Step 2: Run the tests to verify they fail**

Run: `cd /opt/projects/tada5hi/ebec && npm run test -w packages/core -- issues.spec.ts`
Expected: `should omit issues from toJSON when empty` and `should rehydrate an omitted issues key to an empty array` PASS already (the key is absent because nothing emits it yet); `should include issues in toJSON when present` and `should survive a JSON round-trip` FAIL — `toJSON().issues` is `undefined`.

- [ ] **Step 3: Emit the key**

In `packages/core/src/module.ts`, add `issues?: Issue[];` to the `toJSON()` return type after `errors?: unknown[];`, and add the conditional spread after the `errors` spread:

```ts
    toJSON(): {
        name: string;
        message: string;
        code: string;
        cause?: unknown;
        errors?: unknown[];
        issues?: Issue[];
        [INSTANCEOF_PROPERTY]: string[];
    } {
        return {
            name: this.name,
            message: this.message,
            code: this.code,
            ...(this.cause !== undefined && { cause: toSerializable(this.cause) }),
            ...(this.errors !== undefined && { errors: this.errors.map((e) => toSerializable(e)) }),
            ...(this.issues.length > 0 && { issues: [...this.issues] }),
            [INSTANCEOF_PROPERTY]: serializeInstanceofChain(this),
        };
    }
```

The condition is `.length > 0` rather than `!== undefined`, because the property is always an array. Issues are plain data and deliberately bypass `toSerializable`.

- [ ] **Step 4: Run the tests to verify they pass**

Run: `cd /opt/projects/tada5hi/ebec && npm run test -w packages/core -- issues.spec.ts`
Expected: PASS, 8 tests.

- [ ] **Step 5: Run the full core suite and the linter**

Run: `cd /opt/projects/tada5hi/ebec && npm run test -w packages/core && npm run lint`
Expected: all pass.

- [ ] **Step 6: Commit**

```bash
cd /opt/projects/tada5hi/ebec
git add packages/core/src/module.ts packages/core/test/unit/issues.spec.ts
git commit -m "feat(core): serialize issues in toJSON when present"
```

---

### Task 4: `IBaseError` surface and HTTP inheritance guard

**Repository:** `/opt/projects/tada5hi/ebec`

**Files:**
- Modify: `packages/core/src/types.ts`
- Modify: `packages/http/package.json`
- Test: `packages/http/test/unit/issues.spec.ts` (create)

**Interfaces:**
- Consumes: `BaseError#issues` and `BaseError#toJSON()` from Tasks 2 and 3.
- Produces: `IBaseError#issues` typed `ReadonlyArray<Issue> | undefined` — **optional**, unlike the class property.

The HTTP test here is a regression guard, not a red-green cycle: `issues` reaches `BadRequestError` purely by inheritance, so the test is expected to pass the first time it runs. That is the point — it pins behavior nobody wrote code for, so a future change to `HTTPError`'s constructor or `toJSON()` can't quietly drop it. Do not manufacture a failure to make it look like TDD.

- [ ] **Step 1: Let the http package import blemish in its tests**

Run: `cd /opt/projects/tada5hi/ebec && npm install blemish@^1.0.1 --save-dev -w packages/http`

A devDependency, not a dependency: `@ebec/http`'s own source never references blemish, and its emitted types resolve `Issue` through `@ebec/core`'s dependency. Only the test file needs the factories.

This is the one place the plan refines the spec. The spec's `@ebec/http` section said "no source or `package.json` change"; the accurate statement is no source change and no *runtime* dependency. The spec has been corrected to match.

- [ ] **Step 2: Write the guard test**

Create `packages/http/test/unit/issues.spec.ts`:

```ts
import { IssueCode, defineIssueItem } from 'blemish';
import { describe, expect, it } from 'vitest';
import { BadRequestError } from '../../src';

function nameIssue() {
    return defineIssueItem({
        code: IssueCode.REQUIRED,
        path: ['name'],
        message: 'Name is required',
    });
}

describe('http issues', () => {
    it('should default issues to an empty array', () => {
        const error = new BadRequestError('nope');

        expect(error.issues).toEqual([]);
    });

    it('should carry issues on a generated error class', () => {
        const issue = nameIssue();
        const error = new BadRequestError({ message: 'validation failed', issues: [issue] });

        expect(error.status).toEqual(400);
        expect(error.issues).toEqual([issue]);
    });

    it('should serialize issues alongside the status', () => {
        const issue = nameIssue();
        const error = new BadRequestError({ issues: [issue] });
        const output = error.toJSON();

        expect(output.status).toEqual(400);
        expect(output.issues).toEqual([issue]);
    });
});
```

- [ ] **Step 3: Run it**

Run: `cd /opt/projects/tada5hi/ebec && npm run build -w packages/core && npm run test -w packages/http -- issues.spec.ts`
Expected: PASS, 3 tests. The core build is needed first because `@ebec/http` resolves `@ebec/core` through its `dist/`.

If any of these fail, something in Tasks 2-3 is wrong — stop and fix it there rather than adding HTTP-side code. No source change to `packages/http/src/**` belongs in this task.

- [ ] **Step 4: Widen the duck-type interface**

In `packages/core/src/types.ts`, add the type import and the optional property:

```ts
import type { Issue } from 'blemish';
import type { ErrorOptions } from './options';

export type ErrorInput = string | ErrorOptions;

export interface IBaseError extends Error {
    cause?: unknown;
    code: string;
    errors?: ReadonlyArray<Error>;
    issues?: ReadonlyArray<Issue>;
}
```

Optional here, required on the class. `isBaseError` checks only `message` and `code`, so an object rehydrated from JSON that omitted an empty `issues` would otherwise be typed as carrying a property it does not have. A class with a required member still satisfies an interface with an optional one, so `BaseError implements IBaseError` continues to hold.

- [ ] **Step 5: Verify the types compile**

Run: `cd /opt/projects/tada5hi/ebec && npm run build`
Expected: both packages build. This is what catches a broken `implements` relationship — `packages/core/package.json`'s `build:types` runs `tsc` over `src/`.

- [ ] **Step 6: Run everything**

Run: `cd /opt/projects/tada5hi/ebec && npm run test && npm run lint`
Expected: all pass.

- [ ] **Step 7: Commit**

```bash
cd /opt/projects/tada5hi/ebec
git add packages/core/src/types.ts packages/http/package.json packages/http/test/unit/issues.spec.ts package-lock.json
git commit -m "feat(core): expose optional issues on IBaseError"
```

---

### Task 5: Documentation

**Repository:** `/opt/projects/tada5hi/ebec`

**Files:**
- Modify: `packages/core/README.md`
- Modify: `.agents/structure.md`
- Modify: `.agents/architecture.md`

**Interfaces:**
- Consumes: everything from Tasks 2-4.
- Produces: nothing code-facing.

- [ ] **Step 1: Add the README section**

In `packages/core/README.md`, insert a new section between the end of `## Error Grouping` and the `## Error Catalog` heading:

````markdown
## Validation Issues

Use the `issues` option to attach structured validation failures, as a
[blemish](https://github.com/tada5hi/blemish) issue tree:

```typescript
import { IssueCode, defineIssueItem } from 'blemish';
import { BaseError } from '@ebec/core';

throw new BaseError({
    message: 'validation failed',
    code: 'VALIDATION',
    issues: [
        defineIssueItem({
            code: IssueCode.REQUIRED,
            path: ['user', 'name'],
            message: 'Name is required',
        }),
    ],
});
```

`issues` is always an array — it defaults to `[]`, so `error.issues.length`
is safe on every error without a guard.

The tree is stored as given. Group nodes keep their children rather than
being flattened, so a consumer decides for itself whether the grouping
matters:

```typescript
import { flattenIssueItems } from 'blemish';

const byField = Object.fromEntries(
    flattenIssueItems(error.issues).map((item) => [item.path.join('.'), item.message]),
);
```

`toJSON()` includes `issues` only when the array is non-empty, so an error
that carries none does not ship a dead key. This is lossless: the omitted
key rehydrates to `[]` through the constructor default.

```typescript
console.log(JSON.stringify(error, null, 2));
// {
//   "name": "BaseError",
//   "message": "validation failed",
//   "code": "VALIDATION",
//   "issues": [
//     { "code": "required", "path": ["user", "name"], "message": "Name is required" }
//   ]
// }
```

`blemish` is a **types-only** dependency of this package — nothing from it
is imported at runtime, so it adds no bytes to your bundle. Install it
directly if you want the `defineIssueItem` / `flattenIssueItems` helpers.
````

- [ ] **Step 2: Update the README API Reference**

In the same file, under `### BaseError`, add the property to the class sketch and the `issues` key to the `toJSON()` signature:

```typescript
class BaseError extends Error {
    readonly code: string;
    readonly errors?: ReadonlyArray<Error>;
    readonly issues: ReadonlyArray<Issue>;
    cause?: unknown;

    constructor(input?: string | ErrorOptions);
    toJSON(): { name: string; message: string; code: string; cause?: unknown; errors?: unknown[]; issues?: Issue[]; '@instanceof': string[] };
}
```

Under `### ErrorOptions`, add a row after `errors`:

```markdown
| `issues` | `Issue[]` | Structured validation failures, as a blemish issue tree. |
```

- [ ] **Step 3: Correct the zero-dependency claim**

In `.agents/structure.md`, the "Dependency Layer" section currently reads:

```
@ebec/http  →  @ebec/core  →  (no runtime deps)
```

Replace that block and the sentence under it with:

````markdown
```
@ebec/http  →  @ebec/core  →  blemish (types only)
```

`@ebec/core` (packages/core) is the canonical implementation. Its single
dependency, `blemish`, is imported type-only for the `Issue` model — no
blemish value is referenced in `src/`, so the import erases at build and
the package still ships zero runtime bytes beyond its own. `@ebec/http`
depends on `@ebec/core`.
````

- [ ] **Step 4: Update the architecture notes**

In `.agents/architecture.md`, under "BaseError Properties", add the property to the class sketch:

```typescript
class BaseError extends Error {
    readonly code: string;             // Error identifier, derived from class name if not provided
    readonly issues: ReadonlyArray<Issue>; // Validation failures (blemish issue tree); always an array
    override cause?: unknown;          // Underlying cause
}
```

In the "Serialization" subsection directly below it, replace the first sentence with:

```markdown
`toJSON()` returns `{ name, message, code, cause?, errors?, issues?, '@instanceof' }`. If `cause` is a `BaseError`, it is serialized recursively via `toJSON()`. Otherwise, the raw cause value is included. `issues` is emitted only when non-empty — lossless, because the constructor defaults it back to `[]` on rehydration.
```

- [ ] **Step 5: Verify nothing broke**

Run: `cd /opt/projects/tada5hi/ebec && npm run test && npm run lint && npm run build`
Expected: all pass.

If you used `npm link` during the release gate, undo it now and install from the registry, then re-run the above:

```bash
cd /opt/projects/tada5hi/ebec && npm unlink blemish && npm install
```

- [ ] **Step 6: Commit**

```bash
cd /opt/projects/tada5hi/ebec
git add packages/core/README.md .agents/structure.md .agents/architecture.md
git commit -m "docs: document BaseError.issues"
```

---

## Out of scope

`@authup/errors` and `rapiq/core` migrate separately, after `@ebec/core` is published. The spec's final section records the two things whoever picks that up needs to know — that the upgrade is non-breaking for both, and that `useDefineForClassFields` makes a re-declared `issues` without an assignment silently clobber the base constructor's.
