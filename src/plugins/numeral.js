/*!
 * Copyright 2022 plusmeta GmbH
 * License: MIT
 */

(function () {

    /**
     * numeral mixin plugin
     * @param Vue
     * @param numeral
     */
    function plugin(Vue, numeral) {
        if (plugin.installed) {
            return;
        }

        plugin.installed = true;

        if (!numeral) {
            // eslint-disable-next-line no-console
            console.error("You have to install $numeral");
            return;
        }

        Vue.numeral = numeral;

        Object.defineProperties(Vue.prototype, {
            $numeral: {
                get() {
                    return numeral;
                }
            }
        });

        Vue.filter("numeralFormat", (value, format = "0,0") => numeral(value).format(format));
    }

    if (typeof exports == "object") {
        module.exports = plugin;
    } else if (typeof define == "function" && define.amd) {
        define([], function(){ return plugin; });
    } else if (window.Vue && window.numeral) {
        Vue.use(plugin, window.numeral);
    }
})();
