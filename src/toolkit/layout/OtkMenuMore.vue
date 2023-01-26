<!--
 * VDI 2770 Open Toolkit
 * Copyright 2022 plusmeta GmbH
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
      min-width="350"
      :close-on-content-click="false"
    >
      <template v-slot:activator="{ on }">
        <v-btn
          icon
          dark
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
          href="https://digitaldatachain.com/"
          target="_blank"
        >
          <v-list-item-icon>
            <img
              :src="getLogo"
              height="35px"
            >
          </v-list-item-icon>

          <v-list-item-content>
            <v-list-item-title class="subtitle-2">
              VDI 2770 Open Toolkit {{ version }}
            </v-list-item-title>
          </v-list-item-content>
        </v-list-item>

        <v-divider />

        <v-list-item class="py-2">
          <v-list-item-action>
            <v-switch
              :input-value="getSetting('ui_shortcuts')"
              color="primary"
              :disabled="isInternetExplorer"
              @change="setLocalSetting({key: 'ui_shortcuts', value: !!$event})"
            />
          </v-list-item-action>
          <v-list-item-title>{{ $t('Settings.showShortcuts') }}</v-list-item-title>
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
          <v-list-item-title>{{ $t('Settings.useDarkMode') }}</v-list-item-title>
          <v-list-item-action>
            <v-icon>
              mdi-theme-light-dark
            </v-icon>
          </v-list-item-action>
        </v-list-item>

        <v-divider />

        <v-list-item
          class="py-2"
          :disabled="isInternetExplorer"
          @click="restoreSettings"
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

        <v-list-item
          class="py-2"
          @click="showUpsellDialog"
        >
          <v-list-item-action>
            <v-icon color="warning">
              mdi-download
            </v-icon>
          </v-list-item-action>
          <v-list-item-title class="warning--text">
            {{ $t("Otk.manageAccount") }}
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

import util from "@/util";

import LicenseInfoDialog from "@/shared/dialog/LicenseInfoDialog";

export default {
    name: "OtkMenuMore",
    components: {
        LicenseInfoDialog
    },
    data() {
        return {
            showLicenseDialog: false,
            feebdackAddress: "support@plusmeta.de",
            feedbackSubject: "[VDI2770-OT] Feedback",
            version: `v${process.env.VUE_APP_VERSION}`
        };
    },
    computed: {
        getFeedbackLink() {
            return `mailto:${this.feebdackAddress}?subject=${this.feedbackSubject}`;
        },
        isInternetExplorer() {
            return util.isIE();
        },
        ...mapGetters("settings", [
            "isReady",
            "getLogo",
            "getSetting",
            "isDarkTheme"
        ])
    },
    methods: {
        async restoreSettings() {
            if (await this.$confirm.open(
                this.$t("Actions.restoreSettings"),
                this.$t("Actions.restoreSettingsInfo"))) {
                this.setCurrentProgressLocal(1);
                if (this.$matomo) this.$matomo.forgetConsentGiven();
                this.resetSettings(true);
                this.$notify.send(this.$t("Otk.settingsRestored"), "success", 2);
            }
        },
        showUpsellDialog() {
            this.$upsell.open(this.$t("Otk.accountInstance"));
        },
        ...mapActions("settings", [
            "setLocalSetting",
            "resetSettings",
            "changeTheme"
        ]),
        ...mapActions("projects", [
            "setCurrentProgressLocal"
        ])
    }

};
</script>
