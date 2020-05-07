<!--
  Copyright 2020 plusmeta GmbH
  License: MIT
-->

<template>
  <v-tooltip top :disabled="!showTooltip">
    <template v-slot:activator="{ on: tooltip }">
      <v-menu
        offset-y
        nudge-right
      >
        <template v-slot:activator="{ on: menu }">
          <v-btn
            icon
            :class="{'mr-4': left}"
            v-on="{ ...tooltip, ...menu }"
          >
            <v-icon>
              {{ (getCurrentPageHelp) ? "mdi-help-circle" : "mdi-help-circle-outline" }}
            </v-icon>
          </v-btn>
        </template>
        <v-list>
          <v-list-item
            v-if="isHelpPortal"
            :href="getHelpPortalURL"
            :title=" $t('App.helpcenter')"
            target="_blank"
          >
            <v-list-item-icon>
              <v-icon>
                mdi-lifebuoy
              </v-icon>
            </v-list-item-icon>

            <v-list-item-content>
              <v-list-item-title>
                {{ $t("App.helpcenter") }}
              </v-list-item-title>
            </v-list-item-content>
          </v-list-item>
          <v-list-item
            :href="getCurrentHelpLink"
            target="_blank"
          >
            <v-list-item-icon>
              <v-icon>
                {{ (getCurrentPageHelp) ? "mdi-help-circle" : "mdi-help-circle-outline" }}
              </v-icon>
            </v-list-item-icon>

            <v-list-item-content>
              <v-list-item-title v-if="getCurrentPageHelp">
                {{ $t("App.pageHelp") }}
              </v-list-item-title>
              <v-list-item-title v-else>
                {{ $t("App.help") }}
              </v-list-item-title>
              <v-list-item-subtitle v-if="getCurrentPageHelp" class="caption">
                {{ getCurrentPageTitle }}
              </v-list-item-subtitle>
            </v-list-item-content>
          </v-list-item>
        </v-list>
      </v-menu>
    </template>
    <span>{{ (!getCurrentPageHelp) ? $t('App.help') : $t('App.pageHelp') + ': ' + getCurrentPageTitle }}</span>
  </v-tooltip>
</template>

<script>
import config from "@/config";

export default {
    name: "MenuHelpDialog",
    props: {
        helpkey: {
            type: String,
            default: ""
        },
        white: {
            type: Boolean,
            default: false
        },
        left: {
            type: Boolean,
            default: false
        },
        showTooltip: {
            type: Boolean,
            default: true
        }
    },
    computed: {
        isHelpPortal() {
            return config.helpPortal && helpPortal !== "";
        },
        getHelpPortalURL() {
            return config.helpPortal;
        },
        getCurrentPageTitle() {
            return this.$help.getHelpTitle(this.helpkey);
        },
        getCurrentPageHelp() {
            return this.$help.getContextHelp(this.helpkey);
        },
        getCurrentHelpLink () {
            return this.$help.getHelpLink(this.helpkey);
        }
    }
};
</script>
