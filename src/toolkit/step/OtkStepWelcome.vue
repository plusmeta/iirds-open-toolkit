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
          xs6
          offset-xs3
          class="my-6 headline"
          style="font-size: 48px !important; font-weight: 100"
        >
          Willkommen beim iiRDS Open Toolkit
        </v-flex>
        <v-flex
          xs6
          offset-xs3
        >
          Mit dem iiRDS Open Toolkit können Sie in nur wenigen Schritten mit eigenen Inhalten iiRDS-Pakete generieren.
        </v-flex>
        <v-flex
          xs2
          offset-xs4
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
      <img
        src="/images/OTK_triangle.svg"
        height="400px"
        style="position: relative; left: 0; bottom: 0; margin-bottom: -6px"
      >
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
    height: 90% !important;
    min-height: 550px;
  }
</style>