<!-- eslint-disable vue/no-v-html -->
<!--
  Copyright 2020 plusmeta GmbH
  License: MIT
-->

<template>
  <v-flex style="overflow-x: auto;">
    <v-sheet
      v-if="xml"
      height="400"
      min-width="400"
      class="pa-0 mx-auto"
      color="grey lighten-2"
      style="overflow-x: auto;"
    >
      <VueDocPreview
        :value="xml"
        type="code"
        language="xml"
      />
    </v-sheet>
    <v-skeleton-loader
      v-show="!xml"
      class="mx-auto"
      height="400"
      width="400"
      type="image"
    />
  </v-flex>
</template>

<script>
import { mapActions } from "vuex";
import VueDocPreview from "vue-doc-preview";

import util from "@/util";

export default {
    name: "PlusPreviewXML",
    components: {
        VueDocPreview
    },
    props: {
        file: {
            type: Object,
            required: true
        },
        size: {
            type: Number,
            required: false,
            default: 0.5
        }
    },
    data() {
        return {
            xml: null
        };
    },
    mounted() {
        this.render();
    },
    methods: {
        async render() {
            let data = await this.fetchSource(this.file.uuid);
            this.xml = await util.readFile(data, "text");
        },
        ...mapActions("storage", [
            "fetchSource"
        ])
    }
};
</script>

<style>
    .v-skeleton-loader__image {
        height: 100% !important;
        min-height: 400px;
    }
</style>