<template>
  <SingleSetting
    :key="proprelation"
    :uri="proprelation"
    :object-uuid="objectUuid"
    :icon="icon"
    :value="assignedMetavalue"
    :required="required"
    @setting="simpleAssign(objectUuid, $event)"
  >
    <template v-slot:icon="{ icon: innerIcon }">
      <slot :icon="innerIcon" name="icon" />
    </template>
  </SingleSetting>
</template>

<script>
import { mapGetters, mapActions } from "vuex";

import SingleSetting from "@/toolkit/inline/OtkSingleSetting";

export default {
    name: "PlusShowEditMetadata",
    components: { SingleSetting },
    props: {
        objectUuid: {
            type: String,
            required: true
        },
        originUuid: {
            type: String,
            default: undefined
        },
        proprelation: {
            type: String,
            required: true
        },
        icon: {
            type: String,
            default: "mdi-circle"
        },
        required: {
            type: Boolean,
            default: false
        },
        dense: {
            type: Boolean,
            default: false
        },
        indicator: {
            type: Boolean,
            default: true
        }
    },
    data () {
        return {
            loading: false
        };
    },
    computed: {
        assignedMetavalue() {
            return this.getMetadataValueByURI(this.objectUuid, this.proprelation) || "";
        },
        ...mapGetters("storage", [
            "getMetadataValueByURI",
            "getMetadataByURI"
        ]),
        ...mapGetters("properties", [
            "getPropertyLabelById",
            "getInstancesByClassOrRole",
            "getPropertyById"
        ])
    },
    methods: {
        async simpleAssign(uuid, {event, uri}) {
            await this.saveMetaDatum({
                objectUuid: uuid,
                objectMeta: {
                    uri,
                    provenance: "User",
                    value: event
                }
            });
            this.$emit("change");
        },
        ...mapActions("storage", [
            "saveMetaDatum"
        ])
    }
};
</script>
