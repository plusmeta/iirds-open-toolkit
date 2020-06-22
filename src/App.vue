<!--
 * iiRDS Open Toolkit
 * Copyright 2020 plusmeta GmbH
 * License: MIT
-->

<template>
  <v-app>
    <div class="snack-box">
      <v-snackbar
        v-for="(notification, key) of notifications"
        :key="key"
        v-model="notification.visible"
        :color="notification.color"
        :timeout="notification.timeout"
      >
        {{ notification.text }}
        <v-btn icon @click="notification.visible = false">
          <v-icon>mdi-close</v-icon>
        </v-btn>
      </v-snackbar>
    </div>
    <router-view />
    <ConfirmDialog ref="confirm" />
  </v-app>
</template>

<script>
import Vue from "vue";
import util from "@/util";

import { map, scan } from "rxjs/operators";
import { mapGetters } from "vuex";

import ConfirmDialog from "@/shared/dialog/ConfirmDialog.vue";

export default {
    name: "App",
    components: { ConfirmDialog },
    computed: {
        ...mapGetters("settings", [
            "getCurrentLocale",
            "isDarkTheme"
        ])
    },
    watch: {
        async getCurrentLocale() {
            await this.updateLocale();
        },
        isDarkTheme: {
            handler() {
                this.$vuetify.theme.dark =  this.isDarkTheme;
            },
            immediate: true
        }
    },
    created() {
        document.title = util.createTitle(undefined, "tekom");
        this.$auth.initEventBus(this);
        this.updateLocale();
    },
    mounted() {
        this.$confirm.register(this.$refs?.confirm);
    },
    destroyed() {
        this.$confirm.unregister();
    },
    subscriptions() {
        return {
            notifications:
                this.$notify.onMessage().pipe(
                    map(value => Object.assign({ visible: true }, value)),
                    scan((acc, value) => {
                        acc.push(value);
                        if (acc.length > 4)   acc.shift();
                        return acc;
                    }, [])
                )
        };
    },
    methods: {
        async updateLocale() {
            const locale = this.getCurrentLocale;
            const messages = await this.getMessageFile(locale);

            this.$i18n.setLocaleMessage(locale, messages);
            this.$i18n.locale = locale;
            this.$vuetify.lang.current = locale;
            this.$numeral.locale(locale);
            this.$auth.changeLocale(locale);
            document.querySelector("html").setAttribute("lang", locale);
        },
        async getMessageFile(locale) {
            switch (locale) {
            case "de":
                return await import(/* webpackChunkName: "de.locale" */ "@/i18n/locales/de.json");
            case "en":
                return await import(/* webpackChunkName: "en.locale" */ "@/i18n/locales/en.json");
            default:
                return await import(/* webpackChunkName: "de.locale" */ "@/i18n/locales/de.json");
            }
        }
    }
};
</script>
<style>
    .snack-box {
        z-index: 999;
        position: fixed;
        bottom: 40px;
        right: 10px;
    }
</style>
