<template>
  <v-card
    elevation="0" class="mt-3 mb-2"
    style="position: relative;"
  >
    <v-row style="background-color: inherit;">
      <v-col
        class="elevation-0"
        style="border: 1px solid #bbb;border-radius: 4px; position: relative; background-color: inherit;"
      >
        <slot />
      </v-col>
    </v-row>
    <v-card-subtitle
      class="ma-0 pa-0 px-1"
      :class="{ 'required': required }"
      style="background-color: inherit; position: absolute; top: -12px; left: -4px;"
    >
      <v-row>
        <v-col class="pr-1">
          <label>{{ label }}</label>
        </v-col>
        <v-col
          v-if="tooltip && getPropertyTooltip(tooltip)" cols="auto"
          class="pl-0"
        >
          <v-tooltip top>
            <template v-slot:activator="{ on: tooltip }">
              <v-icon
                small
                class="cursor-pointer"
                v-on="tooltip"
              >
                mdi-information-outline
              </v-icon>
            </template>
            <div class="tooltip-width" v-html="getPropertyTooltip(tooltip)" />
          </v-tooltip>
        </v-col>
      </v-row>
    </v-card-subtitle>
  </v-card>
</template>
<script>
import {mapGetters} from "vuex";

export default {
    name: "VFormGroup",
    props: {
        label: {type: String, required: true},
        tooltip: {type: String, default: null},
        required: {type: Boolean, default: false}
    },
    computed: {
        ...mapGetters("properties", ["getPropertyTooltip"])
    }
};
</script>
