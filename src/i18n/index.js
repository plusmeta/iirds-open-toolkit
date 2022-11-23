/*!
 * VDI 2770 Open Toolkit
 * Copyright 2022 plusmeta GmbH
 * License: MIT
 */

import Vue from "vue";
import VueI18n from "vue-i18n";

import de from "@/i18n/locales/de.json";

const dateTimeFormats = {
    "en": {
        short: {
            year: "numeric", month: "short", day: "numeric"
        },
        long: {
            year: "numeric", month: "short", day: "numeric",
            hour: "numeric", minute: "numeric"
        },
        timestamp: {
            month: "short", day: "numeric",
            hour: "numeric", minute: "numeric", second: "numeric"
        },
        timer: {
            timeZone: "UTC",
            hourCycle: "h23",
            hour: "2-digit",
            minute: "2-digit",
            second: "2-digit"
        }
    },
    "de": {
        short: {
            year: "numeric", month: "short", day: "numeric"
        },
        long: {
            year: "numeric", month: "short", day: "numeric",
            hour: "numeric", minute: "numeric"
        },
        timestamp: {
            month: "short", day: "numeric",
            hour: "numeric", minute: "numeric", second: "numeric"
        },
        timer: {
            timeZone: "UTC",
            hourCycle: "h23",
            hour: "2-digit",
            minute: "2-digit",
            second: "2-digit"
        }
    },
    "zh": {
        timer: {
            timeZone: "UTC",
            hourCycle: "h23",
            hour: "2-digit",
            minute: "2-digit",
            second: "2-digit"
        }
    }
};

Vue.use(VueI18n);

export default new VueI18n({
    locale: process.env.VUE_APP_I18N_LOCALE,
    fallbackLocale: process.env.VUE_APP_I18N_FALLBACK_LOCALE,
    messages: {
        de
    },
    silentFallbackWarn: true,
    dateTimeFormats
});
