/*!
 * iiRDS Open Toolkit
 * Copyright 2020 plusmeta GmbH
 * License: MIT
 */

import Vue from "vue";
import VueI18n from "vue-i18n";

import VueNumeral from "@/plugins/numeral";

import de from "@/i18n/locales/de.json";

import numeral from "numeral";
import numeralLocaleDe from "numeral/locales/de";

// Fix für "Cannot read property '_t' of null" Fehler
const I18nPlugin = {
    install(Vue) {
        const _$t = Vue.prototype.$t;
        Vue.prototype._$t = _$t;

        Vue.prototype.$t = function () {
            if (this.$i18n) {
                return _$t.apply(this, arguments);
            } else {
                return _$t.apply(this.$root, arguments);
            }
        };
    }
};

numeral.locale("de");
numeral.nullFormat("--");

Vue.use(VueI18n);
Vue.use(I18nPlugin);
Vue.use(VueNumeral, numeral);

export default new VueI18n({
    locale: process.env.VUE_APP_I18N_LOCALE || "de",
    fallbackLocale: process.env.VUE_APP_I18N_FALLBACK_LOCALE || "en",
    messages: { de: de },
    silentFallbackWarn: true,
});
