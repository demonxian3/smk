module.exports = {
    parser: '@typescript-eslint/parser',
    plugins: [
        'typescript',
    ],
    extends: ["plugin:react/recommended"],
    settings: {
        react: {
            pragma: "React",  // Pragma to use, default to "React"
            version: "detect",
            // React version. "detect" automatically picks the version you have installed.
            // You can also use `16.0`, `16.3`, etc, if you want to override the detected value.
            // default to latest and warns if missing
            // It will default to "detect" in the future
        },
    },
    rules: {
        // 缩进空格的数量 https://eslint.org/docs/rules/indent
        indent: ["error", 4], // 强制缩进为4个空格，也有建议为2的，这个待讨论

        // 'space-indent': ['error', 4],

        // quotes 单双引号限制 https://eslint.org/docs/rules/quotes
        quotes: ["off"], // 关闭单双引号的限制

        // 是否允许定义了但未使用的变量 https://eslint.org/docs/rules/no-unused-vars
        "no-unused-vars": ["off"], // 目前关闭这个限制

        // 函数声明的括号前是否有空格 https://eslint.org/docs/rules/space-before-function-paren
        // "space-before-function-paren": [
        //     "error",
        //     {
        //         anonymous: "always",
        //         named: "always",
        //         asyncArrow: "always",
        //     },
        // ],

        "max-depth": ["error", 4],

        // "one-var": "error",

        "new-cap": "off",

        'max-lines-per-function': [
            'error',
            {
                max: 200,
                skipBlankLines: true,
            },
        ],

        'no-param-reassign': [
            'warn',
            {
                props: false,
            },
        ],

        // 'no-else-return': 'off',

        // 'no-trailing-spaces': ['error', {
        //     skipBlankLines: true,
        // }],

        // React
        "react/prop-types": "off",

        "linebreak-style": [0, "error", "windows"],

        "operator-linebreak": "off",

        "newline-per-chained-call": "off",

        'typescript/class-name-casing': 'error',
    },
};
