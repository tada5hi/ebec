import { readFileSync } from 'fs';

import { createConfig } from '../../rollup.config.mjs';

export default createConfig({
    pkg: JSON.parse(readFileSync(new URL('./package.json', import.meta.url), {encoding: 'utf8'}))
});
