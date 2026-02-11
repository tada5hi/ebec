import { {{baseClass}} } from '../base';
import type { Input } from '../../types';

export const {{{class}}}Options = {
    code: '{{code}}',
    statusCode: {{statusCode}},
    statusMessage: '{{statusMessage}}',
} as const;

export class {{{class}}} extends {{baseClass}} {
    constructor(...input: Input[]) {
        super({{{class}}}Options, ...input);
    }
}
