<!--
 * iiRDS Open Toolkit
 * Copyright 2020 plusmeta GmbH
 * License: MIT
-->

<template>
  <div>
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
        <v-list-item>
          <v-list-item-icon id="logoicon" class="mr-4">
            <v-img
              :src="getLogo"
              width="75px"
            />
          </v-list-item-icon>

          <v-list-item-content>
            <v-list-item-title class="subtitle-1 mb-0">
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
          :disabled="!isMetadataAvailable"
          class="py-2"
          @click="downloadMetadata"
        >
          <v-list-item-action>
            <v-icon :disabled="!isMetadataAvailable">
              mdi-tag-multiple
            </v-icon>
          </v-list-item-action>
          <v-list-item-title>
            {{ $t("Actions.downloadMetadata") }}
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
            version: `v${process.env.VUE_APP_VERSION}`,
            env: process.env.NODE_ENV,
            name: process.env.VUE_APP_NAME,
        };
    },
    computed: {
        customMetadata() {
            return this.getPropertiesByRole("plus:CustomMetadata");
        },
        isMetadataAvailable() {
            return !!this.customMetadata.length;
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
        downloadMetadata() {
            util.downloadJSON(this.customMetadata, "iiRDS-OT-Custom-Metadata.json");
        },
        ...mapActions("settings", [
            "setLocalSetting",
            "resetSettings",
            "changeTheme"
        ])
    }

};
</script>
