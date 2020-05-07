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

// Vue Init-Components
import App from "@/App.vue";
import i18n from "@/i18n";

// Vue Plugins
import VueRx from "vue-rx";
import VueAuth from "@/plugins/auth";
import VueSecurity from "@/plugins/security";
import VueHelp from "@/plugins/help";
import VueNotify from "@/plugins/notify";
import VueConfirm from "@/plugins/confirm";
import VueShortKey from "@/plugins/shortkey";

// UI-Framework, CSS
import vuetify from "@/plugins/vuetify";
import "typeface-ubuntu";
import "typeface-ubuntu-mono";

// Sentry error reporting
import * as Sentry from "@sentry/browser";
import * as Integrations from "@sentry/integrations";

Vue.use(VueRx);

import { AuthenticationService as Auth } from "@/services/auth/auth-service";
import { StandaloneService } from "@/services/auth/standalone-service";

Auth.instance = new StandaloneService(Vue);

Vue.router = Auth.router;
const store = Auth.store;

import { SecurityService as Security } from "@/services/security-service";
import { NotifyService } from "@/services/notify-service";
import { ConfirmService } from "@/services/confirm-service";
import { HelpService } from "@/services/help-service";

Vue.use(VueAuth, Auth.instance);
Vue.use(VueSecurity, Security.instance);
Vue.use(VueHelp, HelpService.instance);
Vue.use(VueNotify, NotifyService.instance);
Vue.use(VueConfirm, ConfirmService.instance);

if (!!+process.env.VUE_APP_LOG_VERSION) {
    // eslint-disable-next-line no-console
    console.log("iiRDS Open Toolkit Version: " + process.env.VUE_APP_VERSION);
    Vue.config.productionTip = false;
}

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

new Vue({
    router: Auth.router,
    store,
    vuetify,
    i18n,
    components: {
        App
    },
    render: h => h(App)
}).$mount("#app");