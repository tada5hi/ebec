# Testing

## Framework

**Vitest 4.x** with V8 coverage provider.

## Running Tests

```bash
# All packages
npm run test

# Single package
npm run test -w packages/ebec
npm run test -w packages/http

# With coverage
npm run test:coverage -w packages/ebec
```

## Configuration

Each package has its own config at `test/vitest.config.ts`. Key settings:

- Test pattern: `test/unit/**/*.{test,spec}.{js,ts}`
- Coverage includes: `src/**/*.{ts,tsx,js,jsx}`
- HTTP package excludes generated files from coverage: `src/errors/client/*.ts`, `src/errors/server/*.ts`

## Coverage Thresholds

Both packages enforce the same minimums:

| Metric | Threshold |
|--------|-----------|
| Branches | 59% |
| Functions | 77% |
| Lines | 73% |
| Statements | 74% |

## Test Structure

Tests mirror the source layout under `test/unit/`:

```
test/unit/
├── module.spec.ts           # Tests for the main class
└── utils/
    └── options.spec.ts      # Tests for options utilities
```

## Writing Tests

- Import `describe`, `expect`, `it` from `vitest`
- Import source via relative paths from `../../src`
- Test both positive cases (valid inputs) and negative cases (type guards returning false)
- Error classes should be tested for correct property defaults, constructor flexibility, and type guard recognition
