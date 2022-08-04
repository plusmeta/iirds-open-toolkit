module.exports = {
    presets: [
        ["@babel/preset-env", {
            "targets": {
                "esmodules": true
            }
        }]
    ],
    plugins: [
        "@babel/plugin-proposal-optional-chaining",
        "@babel/plugin-proposal-class-properties",
        "@babel/plugin-proposal-private-methods",
        "@babel/plugin-syntax-dynamic-import"
    ],
    "env": {
        "test": {
            "plugins": [
                "@babel/plugin-proposal-optional-chaining",
                "@babel/plugin-proposal-class-properties",
                "@babel/plugin-proposal-private-methods",
                "@babel/plugin-syntax-dynamic-import"
            ]
        }
    }
};
