<!-- eslint-disable vue/no-v-html -->
<!--
  Copyright 2022 plusmeta GmbH
  License: MIT
-->

<template>
  <v-container fluid>
    <v-layout wrap>
      <v-flex
        xs6
        lg4
        class="px2"
      >
        <v-card
          dark
          color="accent"
          class="ml-4 mt-8 px-6 py-3 elevation-2"
          outlined
        >
          <v-layout wrap>
            <v-flex>
              <v-img
                src="/images/plusmeta.svg"
                width="64px"
              />
            </v-flex>
            <v-flex class="mt-3">
              <span class="d-inline-block display-1 ">
                VDI 2770 Open Toolkit
              </span>
            </v-flex>
          </v-layout>
          <!-- <v-layout class="mt-4">
            <v-flex>
              <span class="caption">{{ $t("Otk.welcomeTitle") }}</span>
            </v-flex>
          </v-layout> -->
        </v-card>
        <v-card
          color="secondary lighten-3"
          light
          class="ml-4 mt-7 pa-6 elevation-2"
          outlined
        >
          <span>
            Herzlich Willkommen beim <strong>VDI 2770 Open Toolkit</strong> der
            <a
              href="https://www.plusmeta.de"
              target="_blank"
              class="primary--text"
            >plusmeta GmbH</a>.
            Erstellen Sie in wenigen Schritten digitale Hersteller&shy;informationen konform zur <a
              href="https://www.vdi.de/richtlinien/details/vdi-2770-blatt-1-betrieb-verfahrenstechnischer-anlagen-mindestanforderungen-an-digitale-herstellerinformationen-fuer-die-prozessindustrie-grundlagen"
              target="_blank"
              class="primary--text"
            >VDI 2770</a>  und nutzen Sie die Vorteile der
            <a
              href="https://www.digitaldatachain.com"
              target="_blank"
              class="primary--text"
            >Digitalen Datenkette</a>.<br><br>
            Das VDI 2770 Open Toolkit ist kostenlos und ohne Anmeldung nutzbar.<br>
            Angaben zu Ihrer Organisation werden an die plusmeta GmbH zu Produktinformationszwecken übermittelt und lokal in Ihrem Browser gespeichert.
            Alle weiteren Daten und Dokumente werden nicht gespeichert oder übermittelt. Nach einer Aktualisierung Ihres Browsers sind diese Daten nicht mehr verfügbar.
          </span>
        </v-card>
        <v-card
          color="white"
          light
          class="ml-4 mt-7 pa-6 elevation-2"
          outlined
        >
          <span class="caption d-inline-block mb-4">In Kooperation mit</span>
          <v-img src="/images/vdi2770.svg" width="400px" />
        </v-card>
      </v-flex>
      <v-flex class="flex-shrink-1 offset-xs1 xs6 lg7">
        <v-expansion-panels
          focusable
          multiple
          :value="[0,1]"
          class="ml-4 mt-2 pa-6"
        >
          <v-expansion-panel>
            <v-expansion-panel-header
              :outlined="!$vuetify.theme.dark"
              style="min-height: 48px"
              class="py-0"
            >
              <v-row no-gutters>
                <v-col>
                  <span class="subtitle-2">Organisation</span>
                </v-col>
                <v-col cols="auto">
                  <v-badge
                    color="accent"
                    :content="4"
                    inline
                  />
                </v-col>
              </v-row>
            </v-expansion-panel-header>

            <v-expansion-panel-content class="pt-4">
              <v-layout row class="my-4">
                <v-flex class="mx-4">
                  <v-text-field
                    :value="getSetting('base_user_name')"
                    prepend-icon="mdi-account"
                    label="Name"
                    @change="setLocalSetting({key: 'base_user_name', value: $event})"
                  />
                </v-flex>
                <v-flex class="mx-4">
                  <v-text-field
                    :value="getSetting('base_user_mail')"
                    prepend-icon="mdi-email"
                    label="Mail"
                    @change="setLocalSetting({key: 'base_user_mail', value: $event})"
                  />
                </v-flex>
              </v-layout>
              <v-layout row class="my-4">
                <v-flex class="mx-4">
                  <v-text-field
                    :value="getSetting('base_orga_name')"
                    prepend-icon="mdi-domain"
                    label="Organization"
                    @change="setOrganization($event)"
                  />
                </v-flex>
                <v-flex class="mx-4">
                  <v-text-field
                    :value="getSetting('base_orga_url')"
                    prepend-icon="mdi-web"
                    label="Website"
                    @change="setLocalSetting({key: 'base_orga_url', value: $event})"
                  />
                </v-flex>
              </v-layout>
              <v-switch
                :label="$t('Otk.acceptUsageAgreement')"
                :input-value="getSetting('user_eula')"
                @change="setLocalSetting({key: 'user_eula', value: !!$event})"
              />
            </v-expansion-panel-content>
          </v-expansion-panel>
          <v-expansion-panel>
            <v-expansion-panel-header
              :outlined="!$vuetify.theme.dark"
              style="min-height: 48px"
              class="py-0"
            >
              <v-row no-gutters>
                <v-col>
                  <span class="subtitle-2">Equipment</span>
                </v-col>
                <v-col cols="auto">
                  <v-badge
                    color="accent"
                    :content="3"
                    inline
                  />
                </v-col>
              </v-row>
            </v-expansion-panel-header>

            <v-expansion-panel-content class="pt-4">
              <v-layout row class="my-4">
                <v-flex class="mx-4">
                  <v-text-field
                    :value="getCurrentProjectRelationById('plus:ProductLabel')"
                    prepend-icon="mdi-robot-industrial"
                    label="Bezeichnung"
                    @change="updateCurrentProjectRelations({'plus:ProductLabel': $event})"
                  />
                </v-flex>
                <v-flex class="mx-4">
                  <v-text-field
                    :value="getCurrentProjectRelationById('plus:Organization')"
                    prepend-icon="mdi-factory"
                    disabled
                    label="Hersteller"
                  />
                </v-flex>
              </v-layout>
              <v-layout row class="my-4">
                <v-flex class="mx-4">
                  <v-text-field
                    :value="getCurrentProjectRelationById('plus:SerialNumber')"
                    prepend-icon="mdi-counter"
                    label="Seriennummer"
                    @change="updateCurrentProjectRelations({'plus:SerialNumber': $event})"
                  />
                </v-flex>
                <v-flex class="mx-4">
                  <v-text-field
                    :value="getCurrentProjectRelationById('plus:IEC61406')"
                    prepend-icon="mdi-qrcode-scan"
                    label="AutoID (IEC 61355)"
                    @change="updateCurrentProjectRelations({'plus:IEC61406': $event})"
                  />
                </v-flex>
              </v-layout>
            </v-expansion-panel-content>
          </v-expansion-panel>
        </v-expansion-panels>
      </v-flex>
    </v-layout>
    <!-- </v-card> -->
  </v-container>
</template>

<script>
import { mapGetters, mapActions } from "vuex";
import util from "@/util";

export default {
    name: "StepWelcome",
    computed: {
        ...mapGetters("settings", ["getSetting"]),
        ...mapGetters("projects", ["getCurrentProjectRelationById"])
    },
    methods: {
        ...util, // for isIE()
        setOrganization($event) {
            this.setLocalSetting({key: "base_orga_name", value: $event});
            this.updateCurrentProjectRelations({"plus:Organization": $event});
        },
        ...mapActions("settings", ["setLocalSetting"]),
        ...mapActions("projects", ["updateCurrentProjectRelations"])
    }
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
  }
</style>