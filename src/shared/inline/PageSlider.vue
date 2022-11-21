<template>
  <v-row no-gutters>
    <v-col class="text-right px-2" md="auto">
      <v-tooltip top>
        <template v-slot:activator="{ on: tooltip }">
          <v-btn
            :disabled="totalPages === 1"
            fab
            small
            text
            @click="$emit('change', 1)"
            v-on="tooltip"
          >
            1
          </v-btn>
        </template>
        <span>{{ $t("Actions.firstPage") }}</span>
      </v-tooltip>
    </v-col>
    <v-col>
      <v-slider
        color="primary"
        :disabled="totalPages === 1"
        :max="totalPages"
        :min="1"
        :step="1"
        :value="value"
        class="mt-1"
        thumb-label="always"
        thumb-size="24"
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
            @click="$emit('change', totalPages)"
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
    name: "PageSlider",
    props: {
        value: {
            type: Number,
            required: true
        },
        totalPages: {
            type: Number,
            required: true
        }
    }
};
</script>
