<!--
 * iiRDS Open Toolkit
 * Copyright 2020 plusmeta GmbH
 * License: MIT
-->

<template>
  <v-app-bar
    dense
    dark
    color="info"
    app
  >
    <v-toolbar-title>
      <v-img
        :src="getLogo"
        alt="Open Toolkit"
        title="Open Toolkit"
        width="100px"
        class="ml-6 mr-2"
      />
    </v-toolbar-title>
    <v-toolbar-title class="headline">
      Open Toolkit
    </v-toolbar-title>

    <div v-shortkey.push="['shift']" @shortkey="toggleShortcuts" />
    <v-spacer />

    <!-- Right-hand Menus -->
    <MenuHelp
      :helpkey="getStepKey"
      :show-tooltip="false"
    />
    <MenuLanguage />
    <MenuMore />
  </v-app-bar>
</template>

<script>
import { mapGetters, mapActions } from "vuex";

import MenuLanguage from "@/toolkit/layout/OtkMenuLanguage";
import MenuMore from "@/toolkit/layout/OtkMenuMore";
import MenuHelp from "@/shared/dialog/MenuHelpDialog";

export default {
    name: "OtkTopbar",
    components: { MenuLanguage, MenuMore, MenuHelp },
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
            "getLogo",
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
        ...mapActions("settings", [
            "setLocalSetting"
        ])
    }
};
</script>
