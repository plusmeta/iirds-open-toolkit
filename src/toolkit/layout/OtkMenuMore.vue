<!--
 * iiRDS Open Toolkit
 * Copyright 2020 plusmeta GmbH
 * License: MIT
-->

<template>
  <div>
    <form ref="menuForm">
      <input
        ref="menuInput"
        style="display:none;"
        type="file"
        accept=".rdf, application/rdf+xml"
        @change="uploadMetadata($refs.menuInput.files)"
      >
    </form>

    <v-menu
      eager
      offset-y
      nudge-left
      :close-on-content-click="false"
    >
      <template v-slot:activator="{ on }">
        <v-btn
          icon
          :disabled="!isReady"
          v-on="on"
        >
          <v-icon>
            mdi-dots-vertical
          </v-icon>
        </v-btn>
      </template>
      <v-list v-if="isReady">
        <v-list-item
          href="https://iirds.org"
          target="_blank"
        >
          <v-list-item-icon class="mr-4">
            <v-img
              :src="getLogo"
              width="75px"
            />
          </v-list-item-icon>

          <v-list-item-content>
            <v-list-item-title class="overline">
              Open Toolkit {{ version }}
            </v-list-item-title>
          </v-list-item-content>
        </v-list-item>

        <v-divider />

        <v-list-item class="py-2">
          <v-list-item-action>
            <v-switch
              :input-value="getSetting('ui_shortcuts')"
              color="primary"
              @change="setLocalSetting({key: 'ui_shortcuts', value: !!$event})"
            />
          </v-list-item-action>
          <v-list-item-title>{{ $t('Actions.showShortcuts') }}</v-list-item-title>
          <v-list-item-action>
            <v-icon>mdi-apple-keyboard-shift</v-icon>
          </v-list-item-action>
        </v-list-item>

        <v-list-item class="py-2">
          <v-list-item-action>
            <v-switch
              :input-value="isDarkTheme"
              color="primary"
              @change="changeTheme(!!$event)"
            />
          </v-list-item-action>
          <v-list-item-title>{{ $t('Actions.useDarkMode') }}</v-list-item-title>
          <v-list-item-action>
            <v-icon class="mr-5">
              mdi-theme-light-dark
            </v-icon>
          </v-list-item-action>
        </v-list-item>

        <v-divider />

        <v-list-item
          class="py-2"
          @click="$refs.menuInput.click()"
        >
          <v-list-item-action>
            <v-icon>
              mdi-tag-multiple
            </v-icon>
          </v-list-item-action>
          <v-list-item-title>
            {{ $t("Actions.uploadMetadata") }}
          </v-list-item-title>
        </v-list-item>

        <v-list-item
          class="py-2"
          @click="resetSettings(true)"
        >
          <v-list-item-action>
            <v-icon>
              mdi-cog-counterclockwise
            </v-icon>
          </v-list-item-action>
          <v-list-item-title>
            {{ $t("Actions.restoreSettings") }}
          </v-list-item-title>
        </v-list-item>

        <v-divider />

        <v-list-item
          :href="getFeedbackLink"
          class="py-2"
        >
          <v-list-item-action>
            <v-icon>
              mdi-mail
            </v-icon>
          </v-list-item-action>
          <v-list-item-title>
            {{ $t("Actions.giveFeedback") }}
          </v-list-item-title>
        </v-list-item>

        <v-list-item
          class="py-2"
          @click="showLicenseDialog = true"
        >
          <v-list-item-action>
            <v-icon>
              mdi-license
            </v-icon>
          </v-list-item-action>
          <v-list-item-title>
            {{ $t("App.license") }}
          </v-list-item-title>
        </v-list-item>
      </v-list>
    </v-menu>
    <LicenseInfoDialog
      v-if="showLicenseDialog"
      @close="showLicenseDialog = false"
    />
  </div>
</template>

<script>
import { mapGetters, mapActions } from "vuex";

import meta from "@/util/import/meta";

import LicenseInfoDialog from "@/shared/dialog/LicenseInfoDialog";

export default {
    name: "OtkMenuMore",
    components: {
        LicenseInfoDialog
    },
    data() {
        return {
            showLicenseDialog: false,
            feebdackAddress: "info@iirds.org",
            feedbackSubject: "[iiRDS-OT] Feedback",
            version: `v${process.env.VUE_APP_VERSION}`
        };
    },
    computed: {
        getFeedbackLink() {
            return `mailto:${this.feebdackAddress}?subject=${this.feedbackSubject}`;
        },
        ...mapGetters("settings", [
            "isReady",
            "getLogo",
            "getSetting",
            "isDarkTheme"
        ]),
        ...mapGetters("properties", [
            "getPropertiesByRole",
        ])
    },
    methods: {
        async uploadMetadata(uploadedFile) {
            try {
                await meta.analyze(uploadedFile[0], this.$store);
                this.$notify.send(this.$t("Notification.importedMetadata"), "success", 5);
            } catch (error) {
                this.$notify.send(this.$t("Notification.importFailed"), "error", 5);
            } finally {
                this.$refs.menuForm.reset();
            }
        },
        ...mapActions("settings", [
            "setLocalSetting",
            "resetSettings",
            "changeTheme"
        ])
    }

};
</script>
