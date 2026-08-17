import { defineConfig } from 'vitest/config';

export default defineConfig({
    test: {
        include: ['test/unit/**/*.{test,spec}.{js,ts}'],
        coverage: {
            provider: 'v8',
            include: ['src/**/*.{ts,tsx,js,jsx}'],
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
        },
    },
});
