<!-- eslint-disable vue/no-v-html -->
<!--
  Copyright 2020 plusmeta GmbH
  License: MIT
-->

<template>
  <v-flex style="overflow-x: auto;">
    <v-sheet
      v-if="html"
      height="400"
      min-width="550"
      class="html pa-6 mx-auto"
      color="grey lighten-2"
      style="overflow-x: auto;"
      v-html="getSanitizedHTML"
    />
    <v-skeleton-loader
      v-else
      class="mx-auto"
      height="400"
      width="550"
      type="image"
    />
  </v-flex>
</template>

<script>
import sanitize from "@/util/sanitize";
import { mapActions } from "vuex";
import util from "@/util";

import "@/shared/styles/html.css";

export default {
    name: "PlusPreviewHTML",
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
            html: null
        };
    },
    computed: {
        getSanitizedHTML () {
            return sanitize(this.html);
        }
    },
    async created() {
        let data = await this.fetchSource(this.file.uuid);
        if (!!data) {
            this.html = await util.readFile(data, "text");
        }
    },
    methods: mapActions("storage", [
        "fetchSource"
    ])

};
</script>

<style>
    .v-skeleton-loader__image {
        height: 100% !important;
        min-height: 400px;
    }
</style>