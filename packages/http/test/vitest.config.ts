import { defineConfig } from 'vitest/config';

export default defineConfig({
    test: {
        include: ['test/unit/**/*.{test,spec}.{js,ts}'],
        coverage: {
            provider: 'v8',
            include: ['src/**/*.{ts,tsx,js,jsx}'],
            exclude: ['src/errors/client/*.ts', 'src/errors/server/*.ts'],
            thresholds: {
                branches: 59,
                functions: 77,
                lines: 73,
                statements: 74,
            },
        },
    },
});
