<!-- eslint-disable vue/no-v-html -->
<!--
  Copyright 2022 plusmeta GmbH
  License: MIT
-->

<template>
  <v-flex style="overflow-x: auto;">
    <v-sheet
      v-if="file.text"
      height="300"
      min-width="400"
      class="pa-0 mx-auto"
      color="grey lighten-2"
      style="overflow-x: auto;"
    >
      <codemirror
        ref="xmlcode"
        :value="getCode"
        :options="getOptions"
        @ready="highlightLine"
      />
    </v-sheet>
    <v-skeleton-loader
      v-show="!file.text"
      class="mx-auto"
      height="300"
      width="400"
      type="image"
    />
  </v-flex>
</template>

<script>
import { mapGetters } from "vuex";

export default {
    name: "PlusPreviewXML",
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
    computed: {
        getCode() {
            return this.getMetadataValueByURI(this.file.uuid, "plus:Lines");
        },
        getLine() {
            const lines = this.getCode.split("\n");
            return (lines.length >= 3) ? lines[3] : lines[lines.length - 1];
        },
        getLineNr() {
            return this.getMetadataValueByURI(this.file.uuid, "plus:LineNr") || 1;
        },
        getOptions() {
            return { firstLineNumber: Number(this.getLineNr) - 3 };
        },
        ...mapGetters("storage", [
            "getMetadataValueByURI",
        ]),
    },
    methods: {
        highlightLine(editor) {
            const from = {line: 3, ch: 1};
            const to = {line: 3, ch: this.getLine.length};
            editor.doc.markText(from, to, {className: "highlighted"});
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
    .highlighted {
        text-decoration-line: underline;
        text-decoration-style: wavy;
        text-decoration-color: red;

    }
</style>