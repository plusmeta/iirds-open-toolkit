<!-- eslint-disable vue/no-v-html -->
<!--
  Copyright 2020 plusmeta GmbH
  License: MIT
-->

<template>
  <v-card
    v-if="showHelpView"
    class="mb-6"
    :outlined="!$vuetify.theme.dark"
  >
    <v-card-title primary-title>
      <span class="title">
        {{ $help.getHelpTitle(helpkey) }}
      </span>
      <v-spacer />
      <v-btn
        icon
        @click="hideView"
      >
        <v-icon>mdi-close</v-icon>
      </v-btn>
    </v-card-title>
    <v-card-text class="subtitle-2">
      <div v-html="$help.getHelpText(helpkey)" />
    </v-card-text>
  </v-card>
</template>

<script>
import { mapGetters, mapActions } from "vuex";

export default {
    name: "HelpView",
    props: {
        helpkey: {
            type: String,
            required: true
        }
    },
    computed: {
        showHelpView() {
            return !this.getSetting("ui_helpview_" + this.helpkey) &&
              this.$help.getContextHelp(this.helpkey);
        },
        ...mapGetters("settings", [
            "getSetting"
        ]),
    },
    methods: {
        hideView() {
            this.setLocalSetting({key: "ui_helpview_" + this.helpkey, value: true});
        },
        ...mapActions("settings", [
            "setLocalSetting"
        ])
    }
};
</script>
