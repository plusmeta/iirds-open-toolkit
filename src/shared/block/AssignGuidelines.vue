<!-- eslint-disable vue/no-v-html -->
<template>
  <v-card
    class="mb-4 elevation-2"
    color="primary"
    dark
    outlined
  >
    <v-card-title class="pl-6">
      <span class="text-h6">
        {{ $t("Files.guidelines") }}
        <v-tooltip top>
          <template v-slot:activator="{ on }">
            <v-icon
              class="cursor-pointer mb-1"
              right
              v-on="on"
            >
              mdi-information-outline
            </v-icon>
          </template>
          <span>{{ $t("Public.guidelines") }}</span>
        </v-tooltip>
      </span>
      <v-spacer />
      <v-btn
        icon
        @click="$emit('hide')"
      >
        <v-icon>mdi-close</v-icon>
      </v-btn>
    </v-card-title>
    <v-card-text class="px-6 pb-8">
      <v-row>
        <v-col
          v-for="guideline in getGuidelines"
          :key="guideline.id"
          cols="3"
        >
          <GuidelineColumn :guideline="guideline" />
        </v-col>
      </v-row>
    </v-card-text>
  </v-card>
</template>

<script>
import { mapGetters } from "vuex";
import GuidelineColumn from "@/shared/block/GuidelineColumn";

export default {
    name: "BlockAssignGuidelines",
    components: { GuidelineColumn },
    computed: {
        ...mapGetters("properties", [
            "getGuidelines"
        ])
    }
};
</script>
