<!--
  Copyright 2021 plusmeta GmbH
  License: MIT
-->

<template>
  <v-layout>
    <v-flex>
      <v-combobox
        :value="getAssignedListEntries"
        :items="getAssignedListEntries"
        :label="getLabel"
        :prepend-icon="icon"
        multiple
        :rules="[checkRequired]"
        small-chips
        deletable-chips
        :search-input.sync="search"
        return-object
        :class="{ 'required': required }"
        :readonly="isReadonly"
        :disabled="isReadonly"
        @input="changeList"
      >
        <template v-slot:no-data>
          <v-list-item class="py-0">
            <v-list-item-content>
              <span v-html="$t('Actions.createEntry')" />
            </v-list-item-content>
          </v-list-item>
        </template>
      </v-combobox>
    </v-flex>
  </v-layout>
</template>

<script>
import { mapGetters, mapActions } from "vuex";

import template from "@/store/properties/template";

export default {
    name: "ChooseManageList",
    props: {
        objectUuid: {
            type: String,
            required: true
        },
        proplist: {
            type: String,
            required: true
        },
        disabled: {
            type: Boolean,
            default: false
        },
        required: {
            type: Boolean,
            default: false
        },
        label: {
            type: Boolean,
            default: false
        },
        icon: {
            type: String,
            default: ""
        }
    },
    data () {
        return {
            loading: false,
            search: null
        };
    },
    computed: {
        isReadonly() {
            return this.getPropertyAttributeById(this.proplist, "plus:readonly") ?? false;
        },
        getLabel() {
            let label = "";
            if (this.label) label += this.getPropertyLabelById(this.proplist);
            return label;
        },
        getAssignedListEntries() {
            return this.getMetadataValueByURI(this.objectUuid, this.proplist) || [];
        },
        getValueCount() {
            return this.getAssignedListEntries.length;
        },
        ...mapGetters("storage", [
            "getMetadataValueByURI",
            "getMetadataByURI"
        ]),
        ...mapGetters("properties", [
            "getPropertyLabelById",
            "getPropertyAttributeById"
        ])
    },
    methods: {
        changeList(selected) {
            this.saveMetaDatum({
                objectUuid: this.objectUuid,
                objectMeta: {
                    uri: this.proplist,
                    value: selected
                }
            });
            this.$emit("change");
        },
        checkRequired(value) {
            if (this.required && !this.getValueCount) {
                return this.$t("Validations.noEmptyInput");
            } else {
                return true;
            }
        },
        ...mapActions("storage", [
            "saveMetaDatum"
        ])
    }
};
</script>
