<!--
  Copyright 2020 plusmeta GmbH
  License: MIT
-->

<template>
  <v-layout>
    <v-flex>
      <v-combobox
        :value="getAssignedProperty"
        :items="getProperties"
        :label="getLabel"
        :prepend-icon="icon"
        :multiple="multiple"
        :rules="[checkRequired]"
        :small-chips="multiple"
        :deletable-chips="multiple"
        :search-input.sync="search"
        return-object
        @input="selectProperty"
      >
        <template v-slot:no-data>
          <v-list-item class="py-0">
            <v-list-item-content>
              {{ $t("Actions.createEntry") }}
            </v-list-item-content>
          </v-list-item>
        </template>
        <template v-slot:selection="data">
          <PropertyPanel :data="data" :disabled="false" />
        </template>
      </v-combobox>
    </v-flex>
  </v-layout>
</template>

<script>
import { mapGetters, mapActions } from "vuex";

import template from "@/store/properties/template";

import PropertyPanel from "@/shared/inline/PropertyPanel";

export default {
    name: "ChooseCreateProperty",
    components: {
        PropertyPanel
    },
    props: {
        objectUuid: {
            type: String,
            required: true
        },
        propclass: {
            type: String,
            required: true
        },
        proprelation: {
            type: String,
            required: true
        },
        multiple: {
            type: Boolean,
            default: true
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
        isApproved() {
            let meta = this.getMetadataByURI(this.objectUuid, this.proprelation);
            return (meta?.approved === 1) ? true : false;
        },
        isMapped() {
            return !!this.getPropertyRelationById(this.propclass, "plus:dependent-on-relation-mapping").length;
        },
        getLabel() {
            let label = "";
            if (this.label) label += this.getPropertyLabelById(this.propclass);
            if (this.label && this.required) label += "*";
            return label;
        },
        getIcon() {
            return this.icon || "mdi-format-list-bulleted-square";
        },
        getProperties() {
            return this.getInstancesByClassOrRole(this.propclass).map((prop) => {
                return {
                    text: this.getPropertyLabelById(prop.identifier)
                    || `${prop.identifier} [${this.$t("Common.unknown")}]`,
                    value: prop.identifier
                };
            }).sort((a,b) => a.text.localeCompare(b.text));
        },
        getAssignedProperty() {
            let property = this.getMetadataValueByURI(this.objectUuid, this.proprelation);
            if (this.multiple && !!property && typeof property === "string") {
                return [{
                    value: property,
                    text: this.getPropertyLabelById(property)
                    || `${prop.identifier} [${this.$t("Common.unknown")}]`
                }];
            } else if (!!property && typeof property === "string") {
                return {
                    value: property,
                    text: this.getPropertyLabelById(property)
                    || `${prop.identifier} [${this.$t("Common.unknown")}]`
                };
            } else if (!!property && Array.isArray(property)) {
                return property.map((identifier) => {
                    return {
                        value: identifier,
                        text: this.getPropertyLabelById(identifier)
                        || `${identifier} [${this.$t("Common.unknown")}]`
                    };
                });
            } else {
                return (this.multiple) ? [] : undefined;
            }
        },
        ...mapGetters("storage", [
            "getMetadataValueByURI",
            "getMetadataByURI"
        ]),
        ...mapGetters("properties", [
            "getPropertyLabelById",
            "getPropertyRelationById",
            "getInstancesByClassOrRole",
            "getPropertyById"
        ])
    },
    methods: {
        async selectProperty(selected, confidence = 1, provenance = "User") {
            let value = undefined;
            if (this.multiple && Array.isArray(selected)) {
                // to prevent search string from beeing interpreted as ad-hoc property
                // if more objects in selection delete search string from selection
                // if objects are the same, then search string is ad-hoc property
                let onlyObjects = selected.filter(selection => typeof selection !== "string");
                let isSelectedObject = onlyObjects.length > this.getAssignedProperty.length;
                if (isSelectedObject) {
                    selected = onlyObjects;
                    this.search = null;
                }
                // go through all values of selection and decide if select or create property
                value = selected.map((selection) => {
                    if (!!selection && typeof selection === "string") {
                        return this.createAdHocProperty(selection);
                    } else if (!!selection && typeof selection === "object" && selection.hasOwnProperty("value")) {
                        this.search = null;
                        return selection.value;
                    } else {
                        return undefined;
                    }
                }).filter(Boolean);

                value = await Promise.all(value);
            } else {
                if (!!selected && typeof selected === "string") {
                    value = await this.createAdHocProperty(selected);
                } else if (!!selected && typeof selected === "object" && selected.hasOwnProperty("value")) {
                    value = selected.value;
                }
            }

            if (value) {
                await this.saveMetaDatum({
                    objectUuid: this.objectUuid,
                    objectMeta: {
                        uri: this.proprelation,
                        provenance: provenance,
                        confidence: (value.length) ? confidence : 0,
                        value
                    }
                });
                this.$emit("change");
            }
        },
        async createAdHocProperty(label) {
            let newProperty = template({
                datatype: "plus:Instance",
                subClassOf: this.propclass,
                rels: {
                    "plus:has-roles": ["plus:CustomMetadata"]
                },
                label: label
            });

            await this.createProperty([newProperty]);

            this.$notify.send(this.$t("Notification.propertyCreated"), "success");

            return newProperty.identifier;
        },
        checkRequired(value) {
            if (this.required && !value.length) {
                return this.$t("Common.noEmptyInput");
            } else {
                return true;
            }
        },
        ...mapActions("storage", [
            "saveMetaDatum"
        ]),
        ...mapActions("properties", [
            "createProperty",
            "savePropertiesLocal"
        ])
    }
};
</script>
