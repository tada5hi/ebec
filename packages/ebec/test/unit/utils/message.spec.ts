/*
 * Copyright (c) 2022.
 * Author Peter Placzek (tada5hi)
 * For the full copyright and license information,
 * view the LICENSE file that was distributed with this source code.
 */

import { extractMessage } from '../../../src';

describe('src/utils/message.ts', () => {
    it('should extract message', () => {
        const message = extractMessage({}, new Error('foo'), 'foo');
        expect(message).toEqual('foo');
    });
});
