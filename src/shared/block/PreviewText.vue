<!--
  Copyright 2020 plusmeta GmbH
  License: MIT
-->

<template>
  <v-flex style="overflow-x: auto;">
    <v-sheet
      v-if="!!text"
      :height="400 * size"
      :min-width="550 * size"
      class="html pa-6 mx-auto"
      color="grey lighten-2"
      style="overflow-x: auto; overflow-y: auto;"
    >
      {{ text }}
    </v-sheet>
    <v-skeleton-loader
      v-else
      class="mx-auto"
      :height="400 * size"
      :min-width="550 * size"
      type="image"
    />
  </v-flex>
</template>

<script>
import "@/shared/styles/html.css";

export default {
    name: "PlusPreviewText",
    props: {
        text: {
            type: String,
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
</style>