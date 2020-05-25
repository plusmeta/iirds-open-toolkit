<!-- eslint-disable vue/no-v-html -->
<!--
  Copyright 2020 plusmeta GmbH
  License: MIT
-->

<template>
  <v-container
    fluid
    fill-height
    class="skeleton-container"
  >
    <v-card
      class="welcome"
      :class="{'pm-transparent': !$vuetify.theme.dark}"
      align-content-center
    >
      <v-layout>
        <v-flex
          xs8
          offset-xs2
        >
          <v-card
            shaped
            dark
            color="info"
            class="display-2 mt-6 pa-6"
          >
            {{ $t("Otk.welcomeTitle") }}
          </v-card>
        </v-flex>
      </v-layout>
      <v-layout>
        <v-flex
          xs6
          offset-xs5
        >
          <v-card
            shaped
            dark
            color="info darken-3"
            class="headline mt-6 px-6 py-3"
          >
            {{ $t("Otk.welcomeSubtitle") }}
          </v-card>
        </v-flex>
      </v-layout>
      <v-layout>
        <v-flex
          xs5
          offset-xs7
        >
          <v-card
            tile
            outlined
            class="my-6 py-2 pl-4 pr-8"
          >
            <v-card-title>{{ $t("Okt.dataProtectionTitle") }}</v-card-title>
            <v-card-subtitle class="caption" v-html="$t('Otk.dataProtectionText')" />
            <v-card-actions>
              <v-switch
                :label="$t('Otk.acceptUsageAgreement')"
                :input-value="getSetting('user_eula')"
                @change="setLocalSetting({key: 'user_eula', value: !!$event})"
              />
            </v-card-actions>
          </v-card>
        </v-flex>
      </v-layout>
    </v-card>
  </v-container>
</template>

<script>
import { mapGetters, mapActions } from "vuex";

export default {
    name: "StepWelcome",
    computed: mapGetters("settings", ["getSetting"]),
    methods: mapActions("settings", ["setLocalSetting"])
};
</script>

<style>
  div.skeleton-container {
    height: 100%;
    min-height: 100%;
  }

  .welcome {
    width: 100% !important;
    margin-top: 10px;
    background-image: url('/images/OTK_triangle.svg');
    background-repeat: no-repeat;
    background-size: contain;
    background-position: bottom left;
  }
</style>