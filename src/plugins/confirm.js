/*!
 * Copyright 2020 plusmeta GmbH
 * License: MIT
 */

(function () {

    /**
     * Mixin plugin for Confirmation-Dialog
     * @param Vue
     * @param confirm
     */

    function plugin(Vue, confirm) {
        if (plugin.installed) {
            return;
        }

        plugin.installed = true;

        if (!confirm) {
            // eslint-disable-next-line no-console
            console.error("You have to install ConfirmService");
            return;
        }

        Vue.confirm = confirm;

        Object.defineProperties(Vue.prototype, {
            $confirm: {
                get() {
                    return confirm;
                }
            }
        });
    }

    if (typeof exports == "object") {
        module.exports = plugin;
    } else if (typeof define == "function" && define.amd) {
        define([], function(){ return plugin; });
    } else if (window.Vue && window.confirm) {
        Vue.use(plugin, window.confirm);
    }
})();
