module.exports = {
    presets: [
        ["@babel/preset-env", {
            useBuiltIns: "entry",
            corejs: { version: 3, proposals: true }
        }]
    ],
    plugins: [
        "@babel/plugin-proposal-optional-chaining",
        "@babel/plugin-syntax-dynamic-import"
    ]
};
