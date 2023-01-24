<!--
 * VDI 2770 Open Toolkit
 * Copyright 2022 plusmeta GmbH
 * License: MIT
-->

<template>
  <v-menu
    :light="light"
    min-width="300"
    nudge-left
    offset-y
  >
    <template v-slot:activator="{ on }">
      <v-btn
        dark
        :disabled="isDisabled"
        data-cy="lang-btn"
        icon
        v-on="on"
      >
        <v-icon>mdi-earth</v-icon>
      </v-btn>
    </template>
    <v-list v-if="!isDisabled">
      <template v-if="!login">
        <v-list-item>
          <v-list-item-avatar>
            <v-icon
              color="grey"
              large
            >
              mdi-earth-arrow-right
            </v-icon>
          </v-list-item-avatar>
          <v-list-item-content class="grey--text">
            <v-list-item-title class="title mb-0" style="line-height:17px">
              <span style="font-size:15px">{{ getPropertyLabelById("plus:SystemLanguage") }}</span>
            </v-list-item-title>
          </v-list-item-content>
        </v-list-item>

        <v-divider />
      </template>

      <v-list-item-group
        :value="getActiveIndex"
        mandatory
        @change="changeLocale"
      >
        <v-list-item
          v-for="language in getLanguages"
          :key="language.locale"
          :data-cy="language.locale"
        >
          <v-list-item-icon>
            <LanguageIcon :locale="language.locale" />
          </v-list-item-icon>
          <v-list-item-content>
            <v-list-item-title>
              {{ language.label }}
            </v-list-item-title>
          </v-list-item-content>
        </v-list-item>
      </v-list-item-group>
    </v-list>
  </v-menu>
</template>

<script>
import { mapActions, mapGetters } from "vuex";
import LanguageIcon from "@/shared/inline/LanguageIcon";
import match from "@/util/match";
import * as Sentry from "@sentry/browser";

export default {
    name: "OtkMenuLanguage",
    components: {
        LanguageIcon
    },
    props: {
        login: {
            type: Boolean,
            default: false
        },
        light: {
            type: Boolean,
            default: false
        }
    },
    computed: {
        getLanguages() {
            return this.getPropertiesByClass("plus:SystemLanguage")
                .map((syslang) => {
                    const localeFromUiLang = match.parseLocale(this.getPropertyRelationById(syslang.identifier, "plus:refers-to-language")[0]);
                    const label = this.getPropertyLabelById(syslang.identifier);
                    return [localeFromUiLang, label];
                })
                .map(([locale, label]) => ({
                    label,
                    locale
                }));
        },
        getActiveIndex() {
            return this.getLanguages.findIndex(lang => lang.locale === this.getCurrentLocale);
        },
        isDisabled() {
            return !this.login && !this.isReady;
        },
        ...mapGetters("settings", [
            "getCurrentLocale",
            "isReady"
        ]),
        ...mapGetters("properties", [
            "getPropertiesByClass",
            "getPropertyRelationById",
            "getPropertyLabelById"
        ]),
    },
    methods: {
        async changeLocale(index) {
            let locale = this.getLanguages[index].locale;
            Sentry.setTag("locale", this.getCurrentLocale);
            await this.changeLanguageLocal(locale);
        },
        ...mapActions("settings", [
            "changeLanguageLocal"
        ])
    }
};
</script>
