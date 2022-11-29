<!--
  Copyright 2022 plusmeta GmbH
  License: MIT
-->

<template>
  <v-layout>
    <v-flex>
      <v-combobox
        :value="getString(proprelation)"
        :items="allTitles"
        item-text="value"
        item-value="value"
        :search-input.sync="search"
        :disabled="isApproved || loading"
        :loading="loading"
        :label="getLabel"
        :class="{ 'required': required }"
        :return-object="false"
        prepend-icon="mdi-format-title"
        :rules="[checkRequired]"
        @change="selectTitle"
      >
        <template v-slot:no-data>
          <v-list-item class="py-0" dense>
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
    name: "ChooseTitle",
    props: {
        objectUuid: {
            type: String,
            required: true
        },
        label: {
            type: Boolean,
            default: false
        },
        required: {
            type: Boolean,
            default: true
        },
        propclass: {
            type: String,
            required: true
        },
        proprelation: {
            type: String,
            required: true
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
            return !!meta && !!meta.approved;
        },
        allTitles() {
            let uniqueTitles = new Set([
                this.getString("pdf:Title"),
                this.getString("vdi:has-title"),
                this.getString("html:title"),
                this.getString("plus:SimplePDFTitle"),
                this.getString("plus:SimpleHTMLTitle"),
                this.getString("plus:CleanFileName"),
                this.getString("pdf:Subject"),
                this.getString("pdf:Keywords"),
                this.getString("pdf:Description"),
                this.getObjectByUuid(this.objectUuid).name,
                this.generateTitle()
            ]);
            return Array.from(uniqueTitles).filter(title => typeof title === "string" && title.length > 1);
        },
        getTitleBase() {
            return [
                this.getString("plus:relates-to-manufacturer"),
                this.getString("vdi:has-document-type"),
                this.getString("vdi:relates-to-product-variant"),
                this.getString("vdi:has-language")
            ];
        },
        getTitleParts() {
            return this.getTitleBase.filter(Boolean);
        },
        getLabel() {
            let label = "";
            if (this.label) label += this.getPropertyLabelById(this.propclass);
            return label;
        },
        ...mapGetters("storage", [
            "getMetadataValueByURI",
            "getMetadataByURI",
            "getObjectByUuid"
        ]),
        ...mapGetters("properties", [
            "getPropertyLabelById",
            "getInstancesByClass",
            "getPropertyById"
        ]),
        ...mapGetters("workflows", [
            "getCurrentWorkflowSetting"
        ])
    },
    methods: {
        async selectTitle(value, provenance = "User", confidence = 1) {
            await this.saveMetaDatum({
                objectUuid: this.objectUuid,
                objectMeta: {
                    generator: "GenerateTitle",
                    uri: this.proprelation,
                    value,
                    confidence,
                    provenance
                }
            });
        },
        getString(uri) {
            let value = this.getMetadataValueByURI(this.objectUuid, uri);
            if (!value) return undefined;
            return (Array.isArray(value)) ? value[0] : value;
        },
        generateTitle () {
            let generatedTitle = this.getTitleParts.map((titlePart, index) => {
                if (Array.isArray(titlePart)) {
                    return titlePart.map((titlePartEntry, idx) => {
                        return (!!titlePartEntry) ? this.getPropertyLabelById(titlePartEntry) : "";
                    }).join(" / ");
                } else {
                    return (!!titlePart) ? this.getPropertyLabelById(titlePart) : "";
                }
            }).filter(Boolean).join(" - ");

            return (generatedTitle !== "") ? generatedTitle : null;
        },
        checkRequired(value) {
            if (this.required && !!value && !value.length) {
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
