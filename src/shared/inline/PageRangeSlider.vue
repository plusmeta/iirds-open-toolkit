<template>
  <v-row
    no-gutters
  >
    <v-col class="text-right px-2" md="auto">
      <v-tooltip top>
        <template v-slot:activator="{ on: tooltip }">
          <v-btn
            :disabled="totalPages === 1"
            fab
            small
            text
            @click="$emit('change', [1, value[1]])"
            v-on="tooltip"
          >
            1
          </v-btn>
        </template>
        <span>{{ $t("Actions.firstPage") }}</span>
      </v-tooltip>
    </v-col>
    <v-col>
      <v-range-slider
        :color="color"
        :disabled="totalPages === 1"
        :max="totalPages"
        :min="1"
        :readonly="readonly"
        :step="1"
        :value="value"
        class="mt-1"
        thumb-label="always"
        thumb-size="24"
        :thumb-color="color"
        @change="$emit('change', $event)"
      />
    </v-col>
    <v-col class="px-2" md="auto">
      <v-tooltip top>
        <template v-slot:activator="{ on: tooltip }">
          <v-btn
            :disabled="totalPages === 1"
            fab
            small
            text
            @click="$emit('change', [value[0], totalPages])"
            v-on="tooltip"
          >
            {{ totalPages }}
          </v-btn>
        </template>
        <span>{{ $t("Actions.lastPage") }}</span>
      </v-tooltip>
    </v-col>
  </v-row>
</template>

<script>
export default {
    name: "PageRangeSlider",
    props: {
        value: {
            type: Array,
            required: true
        },
        totalPages: {
            type: Number,
            required: true
        },
        color: {
            type: String,
            required: false,
            default: "success"
        },
        readonly: {
            type: Boolean,
            required: false,
            default: false
        },
    }
};
</script>
