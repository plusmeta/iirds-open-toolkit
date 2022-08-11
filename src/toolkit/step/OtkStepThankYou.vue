<!--
 * iiRDS Validation Tool
 * Copyright 2020 plusmeta GmbH
 * License: MIT
-->

<template>
  <v-container
    fluid
    fill-height
    class="pa-6 ty-container"
  >
    <div
      class="pa-6 mb-6 ty-card"
      style="text-align: center"
    >
      <div class="my-12 headline" style="font-size: 96px !important">
        {{ $t('Otk.thankYou') }}
      </div>
      <v-icon
        class="mt-12"
        :size="120"
        color="accent"
      >
        mdi-thumb-up-outline
      </v-icon>

      <p class="my-12 title">
        {{ $t('Otk.thankYouExplainer') }}
      </p>
      <v-btn
        color="accent"
        large
        @click="downloadPackage"
      >
        <v-icon left>
          mdi-download
        </v-icon> {{ $t('Otk.downloadPackage') }}
      </v-btn>

      <v-btn
        v-if="isMetadataAvailable"
        color="secondary"
        class="ml-6"
        large
        @click="downloadMetadata"
      >
        <v-icon left>
          mdi-tag-multiple
        </v-icon> {{ $t("Actions.downloadMetadata") }}
      </v-btn>

      <p class="my-12 title">
        {{ $t('Otk.retry') }}
      </p>
      <v-btn
        color="accent"
        @click="startNewPackage"
      >
        <v-icon left>
          mdi-replay
        </v-icon> {{ $t('Otk.startNewPackage') }}
      </v-btn>
    </div>
  </v-container>
</template>

<script>
import { mapGetters, mapActions } from "vuex";

import util from "@/util";
import meta from "@/util/export/meta";

export default {
    name: "OtkStepGenerateIIRDS",
    computed: {
        customMetadata() {
            return this.getPropertiesByRole("plus:CustomMetadata");
        },
        isMetadataAvailable() {
            return !!this.customMetadata.length;
        },
        ...mapGetters("storage", [
            "getObjectByUuid",
        ]),
        ...mapGetters("properties", [
            "getPropertiesByRole",
        ]),
        ...mapGetters("projects", [
            "getCurrentProjectRelationById",
        ])
    },
    created() {
        // Wenn Adresse aufgerufen wird, aber kein iiRDS-Paket vorhanden ist, dann Redirect zu Start
        if (!this.getCurrentProjectRelationById("plus:relates-to-iirds-package").length) {
            this.$router.replace("/");
        }
    },
    methods: {
        downloadMetadata() {
            let fileContent = meta.export(this.customMetadata, this.$store);
            let metadataFile = new File(
                [fileContent],
                "iiRDS-OT-Custom-Metadata.rdf",
                {type: "application/rdf+xml"}
            );
            util.downloadBlob(metadataFile);
        },
        async downloadPackage() {
            if (this.getCurrentProjectRelationById("plus:relates-to-iirds-package").length > 0) {
                let packageObjectUuid = this.getCurrentProjectRelationById("plus:relates-to-iirds-package")[0];
                let packageObject = this.getObjectByUuid(packageObjectUuid);

                util.downloadBlob(await this.fetchSource(packageObjectUuid), packageObject.source.name);
            }
        },
        startNewPackage() {
            this.$router.push("/");
        },
        ...mapActions("storage", [
            "fetchSource"
        ]),
    }
};
</script>

<style>
  div.ty-container {
    height: 100%;
    min-height: 100%;
  }
  div.ty-card{
    width: 100% !important;
    height: 80% !important;
    min-height: 550px;
  }
</style>