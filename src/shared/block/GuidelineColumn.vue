<template>
  <v-row dense>
    <v-col class="pb-0" offset="1">
      <v-row
        justify="center"
        align="center"
      >
        <v-col cols="auto" class="pr-0">
          <v-icon class="mr-2">
            {{ guideline.icon }}
          </v-icon>
        </v-col>
        <v-col>
          <div
            class="overline"
          >
            {{ guideline.text }}
          </div>

          <div
            style="white-space: pre-line;"
          >
            <span>
              {{ value }}
            </span>
          </div>
        </v-col>
      </v-row>
    </v-col>
  </v-row>
</template>
<script>
export default {
    name: "GuidelineColumn",
    props: {
        guideline: {
            type: Object,
            required: true
        }
    },
    computed: {
        value() {
            return this.guideline?.value?.join(", ");
        }
    }
};
</script>