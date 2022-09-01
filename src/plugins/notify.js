/*!
 * Copyright 2022 plusmeta GmbH
 * License: MIT
 */

(function () {

    /**
     * Notification mixin plugin
     * @param Vue
     * @param notify
     */

    function plugin(Vue, notify) {
        if (plugin.installed) {
            return;
        }

        plugin.installed = true;

        if (!notify) {
            // eslint-disable-next-line no-console
            console.error("You have to install NotificationService");
            return;
        }

        Vue.notify = notify;

        Object.defineProperties(Vue.prototype, {
            $notify: {
                get() {
                    return notify;
                }
            }
        });
    }

    if (typeof exports == "object") {
        module.exports = plugin;
    } else if (typeof define == "function" && define.amd) {
        define([], function(){ return plugin; });
    } else if (window.Vue && window.notify) {
        Vue.use(plugin, window.notify);
    }
})();
