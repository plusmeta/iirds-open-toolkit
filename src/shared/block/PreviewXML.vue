<!-- eslint-disable vue/no-v-html -->
<!--
  Copyright 2022 plusmeta GmbH
  License: MIT
-->

<template>
  <v-flex style="overflow-x: auto;">
    <v-sheet
      v-if="file.text"
      height="400"
      min-width="400"
      class="pa-0 mx-auto"
      color="grey lighten-2"
      style="overflow-x: auto;"
    >
      <VueDocPreview
        :value="file.text"
        type="code"
        language="xml"
      />
    </v-sheet>
    <v-skeleton-loader
      v-show="!file.text"
      class="mx-auto"
      height="400"
      width="400"
      type="image"
    />
  </v-flex>
</template>

<script>
import VueDocPreview from "vue-doc-preview";

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
    }
};
</script>

<style>
    .v-skeleton-loader__image {
        height: 100% !important;
        min-height: 400px;
    }
    .vm-markdown-html {
        padding: 0 !important;
    }
    .vm-markdown-html pre {
        margin: 0 !important;
        border-radius: 0 !important;
    }
</style>