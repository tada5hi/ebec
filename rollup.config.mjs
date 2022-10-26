/*
 * Copyright (c) 2022.
 * Author Peter Placzek (tada5hi)
 * For the full copyright and license information,
 * view the LICENSE file that was distributed with this source code.
 */

import commonjs from '@rollup/plugin-commonjs';
import resolve from '@rollup/plugin-node-resolve';
import babel from '@rollup/plugin-babel';

import { builtinModules } from 'module';

const extensions = [
    '.js', '.mjs', '.ts',
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
                sourcemap: true
            },
            {
                format: 'es',
                file: pkg.module,
                exports: 'named',
                sourcemap: true
            }
        ],
        plugins: [
            // Allows node_modules resolution
            resolve({ extensions}),

            // Allow bundling cjs modules. Rollup doesn't understand cjs
            commonjs(),

            // Compile TypeScript/JavaScript files
            babel({
                extensions,
                babelHelpers: 'bundled',
                include: [
                    'src/**/*'
                ],
            })
        ]
    };
}
