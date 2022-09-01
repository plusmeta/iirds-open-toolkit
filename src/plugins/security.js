/*!
 * Copyright 2022 plusmeta GmbH
 * License: MIT
 */

(function () {

    /**
     * Auth mixin plugin
     * @param Vue
     * @param security
     */

    function plugin(Vue, security) {
        if (plugin.installed) {
            return;
        }

        plugin.installed = true;

        if (!security) {
            // eslint-disable-next-line no-console
            console.error("You have to install $security");
            return;
        }

        Vue.security = security;

        Object.defineProperties(Vue.prototype, {
            $security: {
                get() {
                    return security;
                }
            }
        });
    }

    if (typeof exports == "object") {
        module.exports = plugin;
    } else if (typeof define == "function" && define.amd) {
        define([], function(){ return plugin; });
    } else if (window.Vue && window.security) {
        Vue.use(plugin, window.security);
    }
})();
