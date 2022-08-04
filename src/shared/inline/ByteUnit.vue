<template>
  <span>
    {{ getUnit }}
  </span>
</template>
<script>
import { UnitConverter } from "@/util/unit-converter";

export default {
    name: "ByteUnit",
    props: {
        value: {
            type: Number,
            default: null
        },
        threshold: {
            type: Number,
            default: 1000
        },
        outputUnits: {
            type: Array,
            default: () => ["kilobyte", "megabyte", "gigabyte"]
        },
        defaultString: {
            type: String,
            default: "--"
        }
    },
    computed: {
        getUnit() {
            return UnitConverter.byteToDisplayText(this, this.value, this.defaultString, this.outputUnits, this.threshold);
        }
    }
};
</script>
