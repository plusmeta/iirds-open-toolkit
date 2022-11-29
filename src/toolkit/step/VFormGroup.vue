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
      <label>{{ label }}</label>
    </v-card-subtitle>
  </v-card>
</template>
<script>
export default {
    name: "VFormGroup",
    props: {
        label: { type: String, required: true },
        required: { type: Boolean, default: false }
    }
};
</script>
