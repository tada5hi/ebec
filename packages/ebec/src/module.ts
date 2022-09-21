/*
 * Copyright (c) 2022.
 * Author Peter Placzek (tada5hi)
 * For the full copyright and license information,
 * view the LICENSE file that was distributed with this source code.
 */

import { Options } from './type';
import { buildMessage, buildOptions, hasOwnProperty } from './utils';

export class BaseError extends Error {
    public readonly options: Options;

    //--------------------------------------------------------------------

    constructor(
        data?: string | Error | Options,
        options?: Options,
    ) {
        options = buildOptions(data, options);
        const message = buildMessage(data, options);

        super(message);

        if (this.name === undefined || this.name === 'Error') {
            Object.defineProperty(this, 'name', {
                configurable: true,
                enumerable: false,
                value: this.constructor.name,
                writable: true,
            });
        }

        if (Error.captureStackTrace) {
            Error.captureStackTrace(this, this.constructor);
        }

        /* istanbul ignore next */
        if (typeof this.stack === 'undefined' || this.stack === '') {
            this.stack = new Error(message).stack;
        }

        this.options = {};
        this.setOptions(options);
    }

    //--------------------------------------------------------------------

    public getOptions(): Options {
        return this.options;
    }

    public getOption<T extends keyof Options>(key: T): Options[T] | undefined {
        return this.options[key];
    }

    //--------------------------------------------------------------------

    setOptions(options?: Options): void {
        options = options ?? {};

        const keys = Object.keys(options);
        for (let i = 0; i < keys.length; i++) {
            this.setOption(keys[i], options[keys[i]]);
        }
    }

    public setOption<T extends keyof Options>(key: T, value: Options[T]) {
        Object.assign(this.options, { [key]: value });
    }

    public unsetOption<T extends keyof Options>(key: T) {
        if (hasOwnProperty(this.options, key)) {
            delete this.options[key];
        }
    }
}
