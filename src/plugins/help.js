/*!
 * Copyright 2020 plusmeta GmbH
 * License: MIT
 */

(function () {

    /**
     * Notification mixin plugin
     * @param Vue
     * @param notify
     */

    function plugin(Vue, help) {
        if (plugin.installed) {
            return;
        }

        plugin.installed = true;

        if (!help) {
            // eslint-disable-next-line no-console
            console.error("You have to installHelpService");
            return;
        }

        Vue.help = help;

        Object.defineProperties(Vue.prototype, {
            $help: {
                get() {
                    return help;
                }
            }
        });
    }

    if (typeof exports == "object") {
        module.exports = plugin;
    } else if (typeof define == "function" && define.amd) {
        define([], function(){ return plugin; });
    } else if (window.Vue && window.help) {
        Vue.use(plugin, window.help);
    }
})();
