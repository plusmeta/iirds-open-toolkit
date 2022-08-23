/*!
 * Copyright 2020 plusmeta GmbH
 * License: MIT
 */

// Polyfills
import "core-js/stable";
import "regenerator-runtime/runtime";
import "whatwg-fetch";

// Vue
import Vue from "vue";

// Vue Plugins
import VueRx from "vue-rx";
// import VueMatomo from "vue-matomo";
import VueAuth from "@/plugins/auth";
import VueSecurity from "@/plugins/security";
import VueNotify from "@/plugins/notify";
import VueConfirm from "@/plugins/confirm";
import VueShortKey from "@/plugins/shortkey";

// UI-Framework, CSS
import vuetify from "@/plugins/vuetify";
import "typeface-ubuntu";
import "typeface-ubuntu-mono";

import VueCodemirror from "vue-codemirror";
import "codemirror/lib/codemirror.css";
import "codemirror/theme/xq-light.css";
import "codemirror/mode/xml/xml.js";
//import "codemirror/addon/selection/mark-selection.js";

import { AuthContextHolder } from "@/services/auth/auth-context-holder";
import { StandaloneService } from "@/services/auth/standalone-service";

AuthContextHolder.instance = new StandaloneService(Vue);
import { SecurityService as Security } from "@/services/security-service";
import { NotifyService } from "@/services/notify-service";
import { ConfirmService } from "@/services/confirm-service";

Vue.use(VueAuth, AuthContextHolder.instance);
Vue.use(VueSecurity, Security.instance);
Vue.use(VueNotify, NotifyService.instance);
Vue.use(VueConfirm, ConfirmService.instance);
Vue.use(VueRx);

Vue.use(VueCodemirror, { options: {
    mode: "application/xml",
    lineNumbers: true,
    theme: "xq-light",
    lineWrapping: true,
    readOnly: true
}});

// Vue.use(VueMatomo, {
//     host: "https://statistik.tekom.de",
//     siteId: 13,
//     trackerFileName: "matomo",
//     router: AuthContextHolder.router,
//     enableLinkTracking: true,
//     requireConsent: true,
//     trackInitialView: true,
//     disableCookies: false,
//     cookieDomain: "*.iirds.tekom.de"
// });

if (!!+process.env.VUE_APP_LOG_VERSION) {
    // eslint-disable-next-line no-console
    console.log("iiRDS Validation Tool Version: " + process.env.VUE_APP_VERSION);
    Vue.config.productionTip = false;
}

// Sentry error reporting
import * as Sentry from "@sentry/browser";
import * as Integrations from "@sentry/integrations";
if (!!+process.env.VUE_APP_SENTRY_IS_ACTIVE) {
    // Sentry error logging
    Sentry.init({
        dsn: process.env.VUE_APP_SENTRY_DNS,
        release: `${process.env.VUE_APP_NAME}@${process.env.VUE_APP_VERSION}`,
        environment: process.env.NODE_ENV,
        integrations: [
            new Integrations.Vue({
                Vue,
                attachProps: true,
            })
        ]
    });

    if (!!+process.env.VUE_APP_SENTRY_SHOW_ALSO_CONSOLE_ERR) {
        Vue.config.errorHandler = (error, vm, info) => {
            // eslint-disable-next-line no-console
            console.error(error, vm, info);
        };
    }
}

// Vue Init-Components
import App from "@/App.vue";
import i18n from "@/i18n";

new Vue({
    router: AuthContextHolder.router,
    store: AuthContextHolder.store,
    vuetify,
    i18n,
    components: {
        App
    },
    render: h => h(App)
}).$mount("#app");
