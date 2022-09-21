/*
 * Copyright (c) 2022.
 * Author Peter Placzek (tada5hi)
 * For the full copyright and license information,
 * view the LICENSE file that was distributed with this source code.
 */

import { buildMessage } from '../../../src';

describe('src/utils/message.ts', () => {
    it('should inherit message from previous', () => {
        let message = buildMessage({}, new Error('foo'));
        expect(message).toEqual('foo');

        message = buildMessage({}, {
            previous: new Error('bar'),
        });

        expect(message).toEqual('bar');
    });
});
