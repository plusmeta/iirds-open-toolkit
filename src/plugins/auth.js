/*!
 * Copyright 2020 plusmeta GmbH
 * License: MIT
 */

(function () {

    /**
     * Auth mixin plugin
     * @param Vue
     * @param auth
     */

    function plugin(Vue, auth) {
        if (plugin.installed) {
            return;
        }

        plugin.installed = true;

        if (!auth) {
            // eslint-disable-next-line no-console
            console.error("You have to install $auth");
            return;
        }

        Vue.auth = auth;

        Object.defineProperties(Vue.prototype, {
            $auth: {
                get() {
                    return auth;
                }
            }
        });
    }

    if (typeof exports == "object") {
        module.exports = plugin;
    } else if (typeof define == "function" && define.amd) {
        define([], function(){ return plugin; });
    } else if (window.Vue && window.auth) {
        Vue.use(plugin, window.auth);
    }
})();
