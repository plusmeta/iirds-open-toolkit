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
      class="html pa-6 mx-auto"
      color="grey lighten-2"
      style="overflow-x: auto;"
    >
      <v-xml-tree v-if="xml" :xml-data="xml">
        <template v-slot:expand>
          <v-icon small>
            mdi-plus-circle
          </v-icon>
        </template>
        <template v-slot:hide>
          <v-icon small>
            mdi-minus-circle
          </v-icon>
        </template>
      </v-xml-tree>
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
import util from "@/util";
import vXmlTree from "v-xml-tree";

export default {
    name: "PlusPreviewXML",
    components: {
        vXmlTree
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
        this.renderTree();
    },
    destroyed() {
        this.xml = null;
    },
    methods: {
        async renderTree() {
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
    .xml-tree {
        font-family: "Ubuntu Mono", Consolas, monospace;
        max-width: 400px;
        overflow-x: hidden;
    }
    .xml-tree-tag {
        color: #00769f;
        font-weight: bold;
    }
    .xml-tree-attr {
        color: #4CAF50;
        font-weight: bold;
    }
    .xml-tree-attr + span + .xml-tree-attr {
        color: #333;
        font-weight: normal;
        font-style: italic;
    }
    .xml-tree .xml-tree {
        margin-left: 10px;
    }
</style>