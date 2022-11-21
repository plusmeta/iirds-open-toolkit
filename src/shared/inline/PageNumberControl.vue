<template>
  <v-toolbar-items>
    <v-tooltip bottom>
      <template v-slot:activator="{ on: tooltip }">
        <v-btn
          :disabled="value === 1"
          icon
          @click="$emit('change', 1)"
          v-on="tooltip"
        >
          <v-icon>mdi-arrow-collapse-left</v-icon>
        </v-btn>
      </template>
      <span>{{ $t("Actions.firstPage") }}</span>
    </v-tooltip>
    <v-tooltip bottom>
      <template v-slot:activator="{ on: tooltip }">
        <v-btn
          :disabled="value === 1"
          icon
          @click="$emit('prev')"
          v-on="tooltip"
        >
          <v-icon>mdi-arrow-left</v-icon>
        </v-btn>
      </template>
      <span>{{ $t("Actions.nextPage") }}</span>
    </v-tooltip>
    <v-tooltip bottom>
      <template v-slot:activator="{ on: tooltip }">
        <v-text-field
          :value="value"
          class="d-inline-block ml-4 mr-2 mt-4 pm-page-dial mt-0"
          style="max-width: 30px; min-width: 25px;"
          type="number"
          @change="$emit('change', $event)"
          v-on="tooltip"
        />
      </template>
      <span>{{ $t("Actions.currentPage") }}</span>
    </v-tooltip>
    <v-tooltip bottom>
      <template v-slot:activator="{ on: tooltip }">
        <span
          class="d-inline-block mr-4 mt-5" style="font-size: 16px; white-space: nowrap;"
          v-on="tooltip"
        >/ {{ totalPages }}</span>
      </template>
      <span>{{ $t("Actions.lastPage") }}</span>
    </v-tooltip>
    <v-tooltip bottom>
      <template v-slot:activator="{ on: tooltip }">
        <v-btn
          :disabled="value === totalPages"
          icon
          @click="$emit('next')"
          v-on="tooltip"
        >
          <v-icon>mdi-arrow-right</v-icon>
        </v-btn>
      </template>
      <span>{{ $t("Actions.nextPage") }}</span>
    </v-tooltip>
    <v-tooltip bottom>
      <template v-slot:activator="{ on: tooltip }">
        <v-btn
          :disabled="value === totalPages"
          icon
          @click="$emit('change', totalPages)"
          v-on="tooltip"
        >
          <v-icon>mdi-arrow-collapse-right</v-icon>
        </v-btn>
      </template>
      <span>{{ $t("Actions.lastPage") }}</span>
    </v-tooltip>
    <v-container />
  </v-toolbar-items>
</template>

<script>
export default {
    name: "PageNumberControl",
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
