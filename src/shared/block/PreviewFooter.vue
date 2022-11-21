<template>
  <v-row
    v-if="totalPages > 1"
    no-gutters
  >
    <v-col cols="12">
      <PageSlider
        :value="currentPage"
        :total-pages="totalPages"
        @change="$emit('changepage', $event)"
      />
    </v-col>
  </v-row>
</template>

<script>
import PageSlider from "@/shared/inline/PageSlider";

export default {
    name: "PDFPreviewFooter",
    components: {
        PageSlider
    },
    props: {
        currentPage: {
            type: Number,
            required: false,
            default: 1
        },
        totalPages: {
            type: Number,
            required: true
        }
    }
};
</script>
