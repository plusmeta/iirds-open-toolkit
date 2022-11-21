<template>
  <v-toolbar-items>
    <v-tooltip bottom>
      <template v-slot:activator="{ on: tooltip }">
        <v-btn
          :disabled="rendering"
          icon
          @click="$emit('rotateleft')"
          v-on="tooltip"
        >
          <v-icon>mdi-rotate-left</v-icon>
        </v-btn>
      </template>
      <span>{{ $t("Actions.rotateLeft") }}</span>
    </v-tooltip>
    <v-tooltip bottom>
      <template v-slot:activator="{ on: tooltip }">
        <v-btn
          :disabled="rendering"
          icon
          @click="$emit('rotateright')"
          v-on="tooltip"
        >
          <v-icon>mdi-rotate-right</v-icon>
        </v-btn>
      </template>
      <span>{{ $t("Actions.rotateRight") }}</span>
    </v-tooltip>
  </v-toolbar-items>
</template>

<script>
export default {
    name: "PageRotationControl",
    props: {
        rendering: {
            type: Boolean,
            required: true
        }
    }
};
</script>
