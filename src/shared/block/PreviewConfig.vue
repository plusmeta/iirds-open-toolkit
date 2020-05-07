<template>
  <v-flex style="overflow-x: auto;">
    <v-sheet
      v-if="!!config"
      :height="400 * size"
      :min-width="550 * size"
      class="html pa-6 mx-auto"
      color="secondary darken-1"
      style="overflow-x: auto;"
    >
      <vue-json-pretty
        :data="JSON.parse(config)"
        :deep="1"
      />
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
import VueJsonPretty from "vue-json-pretty";
import "@/shared/styles/json.css";

export default {
    name: "PlusPreviewConfig",
    components: { VueJsonPretty },
    props: {
        config: {
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