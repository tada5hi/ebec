import resolve from '@rollup/plugin-node-resolve';
import { builtinModules } from 'node:module';
import swc from 'unplugin-swc';

const extensions = [
    '.js', '.cjs', '.mjs', '.ts',
];

export function createConfig({ pkg, external = [] }) {
    external = Object.keys(pkg.dependencies || {})
        .concat(Object.keys(pkg.peerDependencies || {}))
        .concat(builtinModules)
        .concat(external);

    return {
        input: 'src/index.ts',
        external,
        output: [
            {
                format: 'cjs',
                file: pkg.main,
                exports: 'named',
                sourcemap: true,
            },
            {
                format: 'es',
                file: pkg.module,
                sourcemap: true,
            },
        ],
        plugins: [
            // Allows node_modules resolution
            resolve({ extensions }),

            swc.rollup(),
        ],
    };
}
