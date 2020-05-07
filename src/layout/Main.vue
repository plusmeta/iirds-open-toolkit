<!--
 * iiRDS Open Toolkit
 * Copyright 2020 plusmeta GmbH
 * License: MIT
-->

<template>
  <v-app>
    <Topbar />
    <v-content>
      <v-progress-linear
        v-if="!isReady"
        indeterminate
        color="primary"
        style="position: absolute"
      />
      <v-fade-transition mode="out-in">
        <router-view v-if="isReady" />
      </v-fade-transition>
    </v-content>
    <BottomNav v-if="isReady" />
  </v-app>
</template>

<script>
import { mapGetters, mapActions } from "vuex";

import Topbar from "@/toolkit/layout/OtkTopbar";
import BottomNav from "@/toolkit/layout/OtkBottomNav";

import template from "@/store/projects/template";

export default {
    name: "OtkMain",
    components: { Topbar, BottomNav },
    computed: {
        ...mapGetters("settings", [
            "isReady"
        ])
    },
    async created() {
        this.startApplication(false);
        await this.$auth.ready(true);

        try {
            await this.fetchProperties();
            await this.initWorkflowsLocal();
            await this.resetSettings();

            let newProject = template.project({ workflow: "iirds-open-toolkit" });
            await this.startNewProjectLocal(newProject);
        } catch (e) {
            // eslint-disable-next-line no-console
            console.debug(e);
        } finally {
            this.startApplication(true);
        }
    },
    methods: {
        ...mapActions("settings", [
            "resetSettings",
            "startApplication"
        ]),
        ...mapActions("workflows", [
            "initWorkflowsLocal"
        ]),
        ...mapActions("projects", [
            "initProjects",
            "startNewProjectLocal"
        ]),
        ...mapActions("properties", [
            "fetchProperties"
        ])
    }
};
</script>
