/*
 * Copyright (c) 2022.
 * Author Peter Placzek (tada5hi)
 * For the full copyright and license information,
 * view the LICENSE file that was distributed with this source code.
 */

import resolve from '@rollup/plugin-node-resolve';
import { transform } from "@swc/core";
import { builtinModules } from 'node:module';

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
                sourcemap: true
            },
            {
                format: 'es',
                file: pkg.module,
                sourcemap: true
            }
        ],
        plugins: [
            // Allows node_modules resolution
            resolve({ extensions}),

            {
                name: 'swc',
                transform(code) {
                    return transform(code, {
                        jsc: {
                            target: 'es2016',
                            parser: {
                                syntax: 'typescript'
                            },
                            loose: true
                        },
                        sourceMaps: true
                    });
                }
            },
        ]
    };
}
