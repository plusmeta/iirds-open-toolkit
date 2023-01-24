<template>
  <v-chip
    :disabled="(!hasReport && !conformance) || !isSupportedObjectType"
    :title="report.join(', ')"
  >
    <span v-if="hasReport && isSupportedObjectType">
      <v-icon left>
        mdi-close-circle-outline
      </v-icon>
      <span>
        {{ conformance || $t("Common.invalid") }}
      </span>
    </span>
    <span v-else-if="conformance && isSupportedObjectType">
      <v-icon left>
        mdi-checkbox-marked-circle-outline
      </v-icon>
      {{ conformance }}
    </span>
    <span v-else>
      <v-icon left>
        mdi-circle-outline
      </v-icon>
      {{ $t("Common.unknown") }}
    </span>
  </v-chip>
</template>
<script>
import util from "@/util";

export default {
    name: "ConformanceInfo",
    props: {
        value: {
            type: Object,
            required: true
        }
    },
    computed: {
        hasReport() {
            return this.report?.length > 0;
        },
        isSupportedObjectType() {
            return this.value?.source?.type === "application/pdf" ||
            this.value?.type === "vdi:DocumentationContainer";
        },
        report() {
            return util.getMetadataValue(this.value, "plus:ValidationReport") || [];
        },
        conformance() {
            return util.getMetadataValueAsArray(this.value, "plus:Conformity")[0];
        }
    }
};
</script>