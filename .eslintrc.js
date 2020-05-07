module.exports = {
    "env": {
        "browser": true,
        "commonjs": true
    },
    "extends": [
        "plugin:vue/recommended",
    ],
    "parserOptions": {
        "parser": "babel-eslint",
        "ecmaVersion": 9,
        "sourceType": "module",
        "ecmaFeatures": {
            "jsx": true
        },
        "allowImportExportEverywhere": true
    },
    "plugins": [
        "vue"
    ],
    "rules": {
        "no-debugger": "warn",
        "no-console": "warn",
        "no-alert": "error",
        "no-eq-null": "error",
        "require-await": "error",
        "no-return-assign": ["error", "always"],
        "arrow-parens": [2, "as-needed", { "requireForBlockBody": true }],
        "indent": [
            "error",
            4
        ],
        "quotes": [
            "error",
            "double"
        ],
        "semi": [
            "error",
            "always"
        ],
        "no-trailing-spaces": "error",
        "vue/max-attributes-per-line": [2, {
            "singleline": 2,
            "multiline": {
                "max": 2,
                "allowFirstLine": false
            }
        }]
    }
};
