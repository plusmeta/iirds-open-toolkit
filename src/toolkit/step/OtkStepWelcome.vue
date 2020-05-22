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
            Willkommen beim iiRDS Open Toolkit!
          </v-card>
        </v-flex>
      </v-layout>
      <v-layout>
        <v-flex
          xs7
          offset-xs4
        >
          <v-card
            shaped
            dark
            color="info darken-3"
            class="headline mt-6 px-6 py-3"
          >
            Mit dem kostenlosen iiRDS Open Toolkit können Sie in nur wenigen Schritten mit eigenen Inhalten iiRDS-Pakete generieren.
          </v-card>
        </v-flex>
      </v-layout>
      <v-layout>
        <v-flex
          xs6
          offset-xs6
        >
          <v-card
            tile
            outlined
            class="my-6 pa-4"
          >
            <v-card-title>Nutzungsbedingungen & Datenschutz</v-card-title>
            <v-card-subtitle class="caption">
              Für ein besseres Benutzererlebniss setzen wir Systeme zur Zugriffs- und Fehler&shy;analyse ein.
              Dateien, die im iiRDS Open Toolkit verwendet werden, verlassen nicht Ihren Rechner.
              Bitte Akzeptieren Sie unsere <a href="#">Daten&shy;schutz&shy;bestimmung</a> zum Fortfahren.
            </v-card-subtitle>
            <v-card-actions>
              <v-switch
                label="Nutzungsbedingungen akzeptiert"
                :input-value="getSetting('user_eula')"
                @change="setLocalSetting({key: 'user_eula', value: !!$event})"
              />
            </v-card-actions>
          </v-card>
        </v-flex>
      </v-layout>
      <!-- <v-layout>
        <v-flex xs12>
          <v-btn color="info" class="float-right">
            Start
          </v-btn>
        </v-flex>
      </v-layout> -->
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