import { extractMessage } from '../../../src';

describe('src/utils/message.ts', () => {
    it('should extract message', () => {
        const message = extractMessage({}, new Error('foo'), 'foo');
        expect(message).toEqual('foo');
    });
});
