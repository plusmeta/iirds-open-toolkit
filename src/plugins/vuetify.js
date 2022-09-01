/*!
 * Copyright 2022 plusmeta GmbH
 * License: MIT
 */

import "@mdi/font/css/materialdesignicons.css";

import Vue from "vue";
import Vuetify from "vuetify/lib";

import de from "vuetify/es5/locale/de";
import en from "vuetify/es5/locale/en";

import { theme } from "@/config/settings/theme.json";

Vue.use(Vuetify);

export default new Vuetify({
    lang: {
        locales: { de, en },
        current: "de",
    },
    theme
});
