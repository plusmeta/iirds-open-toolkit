<!--
 * iiRDS Open Toolkit
 * Copyright 2020 plusmeta GmbH
 * License: MIT
-->

<template>
  <v-menu
    offset-y
    nudge-left
  >
    <template v-slot:activator="{ on }">
      <v-btn
        icon
        :disabled="!isReady"
        v-on="on"
      >
        <v-icon>mdi-web</v-icon>
      </v-btn>
    </template>
    <v-list v-if="isReady">
      <v-list-item
        v-for="language in getLanguages"
        :key="language.identifier"
        :disabled="language.locale === getCurrentLocale"
        @click="changeLocale(language.locale)"
      >
        <v-list-item-icon>
          <country-flag :country="language.country" size="normal" />
        </v-list-item-icon>
        <v-list-item-content>
          <v-list-item-title>{{ language.label }}</v-list-item-title>
        </v-list-item-content>
      </v-list-item>
    </v-list>
  </v-menu>
</template>

<script>
import CountryFlag from "vue-country-flag";
import { mapGetters, mapActions } from "vuex";

export default {
    name: "OtkMenuLanguage",
    components: { CountryFlag },
    computed: {
        getLanguages() {
            return this.getPropertiesByClass("plus:SystemLanguage").map((syslang) => {
                let language = this.getPropertyRelationById(syslang.identifier, "plus:refers-to-language")[0];
                return {
                    label: this.getPropertyLabelById(syslang.identifier, this.getCurrentLocale),
                    identifier: syslang.identifier,
                    locale:  (language?.split("-") || [])[0],
                    country: (language?.split("-") || [])[1]
                };
            });
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
        async changeLocale(locale) {
            if (this.$route.path.includes("login")) {
                this.$store.commit("settings/CHANGE_LANGUAGE", locale);
            } else {
                await this.changeLanguageLocal(locale);
            }
        },
        ...mapActions("settings", [
            "changeLanguageLocal"
        ])
    }
};
</script>
