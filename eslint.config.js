import config from '@tada5hi/eslint-config';

export default [
    ...await config(),
    {
        ignores: ['**/dist/**', '**/errors/client/**', '**/errors/server/**'],
    },
    {
        rules: {
            'class-methods-use-this': 'off',
            'dot-notation': 'off',
            'no-use-before-define': 'off',

            '@typescript-eslint/no-throw-literal': 'off',
            '@typescript-eslint/no-unused-vars': 'off',
            '@typescript-eslint/no-use-before-define': 'off',
        },
    },
];
