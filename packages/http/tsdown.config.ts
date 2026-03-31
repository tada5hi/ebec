import { defineConfig } from 'tsdown';

export default defineConfig({
    entry: {
        index: 'src/index.ts',
        'core/index': 'src/core-export.ts',
    },
    format: ['esm', 'cjs'],
    dts: true,
    sourcemap: true,
});
