var path = require("path");
const babelConfig = require("./babel.config");
// IDE/Resolving and cypress testing
module.exports = {
    resolve: {
        alias: {
            "@": path.resolve(__dirname) + "/src",
            "~": path.resolve(__dirname) + "/src",
            "#": path.resolve(__dirname) + "/tests"
        }
    },
    module: {
        rules: [
            {
                test: /\.jsx?$/,
                exclude: [/node_modules/],
                use: [
                    {
                        loader: "babel-loader",
                        options: babelConfig,
                    },
                ],
            },
            {
                test: /pdfjs-dist/,
                use: [
                    {
                        loader: "babel-loader",
                        options: babelConfig,
                    },
                ],
            },
        ],
    }
};
