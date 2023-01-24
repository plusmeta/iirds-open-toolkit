<!--
 * VDI 2770 Open Toolkit
 * Copyright 2022 plusmeta GmbH
 * License: MIT
-->

<template>
  <v-app-bar
    dense
    color="accent"
    app
  >
    <v-toolbar-title>
      <img
        :src="getLogoForTheme('dark')"
        alt="Open Toolkit"
        title="Open Toolkit"
        height="40px"
        class="ml-4 mr-4 mt-2"
      >
    </v-toolbar-title>
    <v-toolbar-title class="subtitle-1 font-weight-bold white--text">
      VDI 2770 Open Toolkit
    </v-toolbar-title>

    <div v-shortkey.push="['shift']" @shortkey="toggleShortcuts" />
    <v-spacer />

    <!-- Right-hand Menus -->
    <v-btn
      small
      class="mr-4 elevation-0"
      color="warning"
      @click="showUpsellDialog"
    >
      <v-icon left>
        mdi-lifebuoy
      </v-icon>
      Support
    </v-btn>
    <MenuLanguage />
    <MenuMore />
  </v-app-bar>
</template>

<script>
import { mapGetters, mapActions } from "vuex";

import MenuLanguage from "@/toolkit/layout/OtkMenuLanguage";
import MenuMore from "@/toolkit/layout/OtkMenuMore";

export default {
    name: "OtkTopbar",
    components: { MenuLanguage, MenuMore },
    data() {
        return {
            initital: false
        };
    },
    computed: {
        getStepKey() {
            const workflowRoutes = ["OtkWorkflowView", "OtkWorkflowStep"];
            if (workflowRoutes.includes(this.$route.name) &&
                this.getCurrentWorkflowStep.helpkey) {
                return this.getCurrentWorkflowStep.helpkey;
            } else {
                return null;
            }
        },
        ...mapGetters("settings", [
            "getLogoForTheme",
            "getSetting"
        ]),
        ...mapGetters("workflows", [
            "getCurrentWorkflowStep"
        ])
    },
    methods: {
        toggleShortcuts($event) {
            if (!this.initital && !this.getSetting("ui_shortcuts")) {
                this.initital = true;
                this.setLocalSetting({ key: "ui_shortcuts", value: true });
            } else if (this.initital === true) {
                this.initital = false;
                this.setLocalSetting({ key: "ui_shortcuts", value: false });
            }
        },
        showUpsellDialog() {
            this.$upsell.open(this.$t("Otk.support"));
        },
        ...mapActions("settings", [
            "setLocalSetting"
        ])
    }
};
</script>
