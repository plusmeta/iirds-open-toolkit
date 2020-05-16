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
    <v-sheet
      class="welcome pt-12 mx-12"
      align-content-center
    >
      <v-layout row>
        <v-flex
          xs9
          offset-xs2
          class="my-6 headline"
          style="font-size: 48px !important; font-weight: 100"
        >
          Willkommen beim iiRDS Open Toolkit!
        </v-flex>
        <v-flex
          xs9
          offset-xs2
        >
          Mit dem iiRDS Open Toolkit können Sie in nur wenigen Schritten mit eigenen Inhalten iiRDS-Pakete generieren.
        </v-flex>
        <v-flex
          xs9
          offset-xs2
          class="mt-12"
        >
          Akzeptieren Sie die Nutzungsbedingungen zum Fortfahren.
          <v-checkbox
            label="Nutzungsbedingungen akzeptiert"
            :input-value="getSetting('user_eula')"
            @change="setLocalSetting({key: 'user_eula', value: !!$event})"
          />
        </v-flex>
      </v-layout>
    </v-sheet>
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
    min-height: 100% !important;
    background-image: url('/images/OTK_triangle.jpg');
    background-repeat: no-repeat;
    background-size: contain;
    background-position: top center;
  }
</style>