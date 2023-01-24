/*!
 * Copyright 2022 plusmeta GmbH
 * License: MIT
 */

(function () {

    /**
     * Mixin plugin for Upsell-Dialog
     * @param Vue
     * @param upsell
     */

    function plugin(Vue, upsell) {
        if (plugin.installed) {
            return;
        }

        plugin.installed = true;

        if (!upsell) {
            // eslint-disable-next-line no-console
            console.error("You have to install UpsellService");
            return;
        }

        Vue.upsell = upsell;

        Object.defineProperties(Vue.prototype, {
            $upsell: {
                get() {
                    return upsell;
                }
            }
        });
    }

    if (typeof exports == "object") {
        module.exports = plugin;
    } else if (typeof define == "function" && define.amd) {
        define([], function(){ return plugin; });
    } else if (window.Vue && window.upsell) {
        Vue.use(plugin, window.upsell);
    }
})();
