/* eslint-disable quotes */
/* eslint-disable indent */

const Package = require("./package.json");

process.env.VUE_APP_VERSION = Package.version;
process.env.VUE_APP_NAME = Package.name;
process.env.VUE_APP_WEB = Package.homepage;
process.env.VUE_APP_REPO = Package.repository;

module.exports = {
    configureWebpack: {
        devtool: process.env.NODE_ENV === 'test' ? '#inline-cheap-module-source-map' : 'source-map',
        output: {
            devtoolModuleFilenameTemplate: '[absolute-resource-path]',
            devtoolFallbackModuleFilenameTemplate: '[absolute-resource-path]?[hash]'
        },
        performance: {
            hints: process.env.VUE_APP_IS_DEBUGGING === '1' ? false : 'warning'
        },
        resolve: {
            alias: {
                fs: 'pdfkit/js/virtual-fs.js'
            }
        },
        module: {
            rules: [
                { enforce: 'post', test: /fontkit[/\\]index.js$/, loader: "transform-loader?brfs" },
                { enforce: 'post', test: /unicode-properties[/\\]index.js$/, loader: "transform-loader?brfs" },
                { enforce: 'post', test: /linebreak[/\\]src[/\\]linebreaker.js/, loader: "transform-loader?brfs" },
                { test: /src[/\\]assets/, loader: 'arraybuffer-loader' },
                { test: /\.afm$/, loader: 'raw-loader' }
            ]
        }
    },
    chainWebpack: (config) => {
        config
            .plugin("prefetch")
            .tap((options) => {
                options[0].fileBlacklist = options[0].fileBlacklist || [];
                options[0].fileBlacklist.push(/\.locale[.~]*.*\.js/);
                options[0].fileBlacklist.push(/\.help[.~]*.*\.js/);
                options[0].fileBlacklist.push(/\.step[.~]*.*\.(js|css|css.map)/);
                options[0].fileBlacklist.push(/\.restricted[.~]*.*\.(js|css|css.map)/);
                options[0].fileBlacklist.push(/([wW])orker[.~]*.*\.js/);
                options[0].fileBlacklist.push(/\.pdf*.*\.js/);
                options[0].fileBlacklist.push(/\.util[.~]*.*\.(js|css|css.map)/);
                options[0].fileBlacklist.push(/\.import[.~]*.*\.(js|css|css.map)/);
                return options;
            });

        config.module
            .rule("js")
            .exclude
                .add(/\.worker\.js$/);
        config.module
            .rule("worker")
            .test(/\.worker\.js$/)
            .exclude
                .add(/pdf\.worker\.js$/)
                .end()
            .use("worker-loader")
                .loader("worker-loader")
                .options({
                    filename: "[name].[hash].worker.js"
                })
                .end();
    },
    pluginOptions: {
        i18n: {
            locale: process.env.VUE_APP_I18N_LOCALE,
            fallbackLocale: process.env.VUE_APP_I18N_FALLBACK_LOCALE,
            localeDir: "locales",
            enableInSFC: true
        }
    },
    transpileDependencies: [
        "vuetify",
        "pdfjs-dist"
    ],
    productionSourceMap: false,
    css: {
        sourceMap: true
    }
};
