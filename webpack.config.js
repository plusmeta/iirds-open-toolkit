var path = require("path");
const babelConfig = require("./babel.config");
module.exports = {
    resolve: {
        // IDE/Resolving
        alias: {
            "@": path.resolve(__dirname),
            "~": path.resolve(__dirname)
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
