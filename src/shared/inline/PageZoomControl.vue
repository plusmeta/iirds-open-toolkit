<template>
  <v-toolbar-items>
    <v-tooltip bottom>
      <template v-slot:activator="{ on: tooltip }">
        <v-btn
          :disabled="rendering"
          icon
          @click="$emit('zoomout')"
          v-on="tooltip"
        >
          <v-icon>mdi-magnify-minus</v-icon>
        </v-btn>
      </template>
      <span>{{ $t("Actions.zoomOut") }}</span>
    </v-tooltip>
    <v-slider
      :disabled="rendering"
      :max="4.5"
      :min="0.3"
      :step="0.1"
      :value="value"
      class="mt-5"
      style="min-width: 150px;"
      color="primary"
      @change="$emit('change', $event)"
    />
    <v-tooltip bottom>
      <template v-slot:activator="{ on: tooltip }">
        <v-btn
          :disabled="rendering"
          icon
          @click="$emit('zoomin')"
          v-on="tooltip"
        >
          <v-icon>mdi-magnify-plus</v-icon>
        </v-btn>
      </template>
      <span>{{ $t("Actions.zoomIn") }}</span>
    </v-tooltip>
  </v-toolbar-items>
</template>

<script>
export default {
    name: "PageZoomControl",
    props: {
        value: {
            type: Number,
            required: true
        },
        rendering: {
            type: Boolean,
            required: true
        }
    }
};
</script>
