<!--
 * VDI 2770 Open Toolkit
 * Copyright 2022 plusmeta GmbH
 * License: MIT
-->
<!-- eslint-disable vue/no-v-html -->
<template>
  <v-container fluid>
    <v-layout wrap>
      <v-flex
        xs6
        lg4
        class="px2"
      >
        <PreviewPDF
          v-if="isPDF"
          :file="object"
        />
        <v-skeleton-loader
          v-else
          class="mx-auto"
          boilerplate
          type="image"
          height="400"
          width="300"
        />
      </v-flex>
      <v-flex class="flex-shrink-1 offset-xs1 xs5 lg7">
        <v-expansion-panels
          v-model="activeGroups"
          focusable
          accordion
          multiple
        >
          <v-expansion-panel v-for="groupId in getMetadataOrderedGroups" :key="groupId">
            <v-expansion-panel-header
              :outlined="!$vuetify.theme.dark"
              style="min-height: 48px"
              class="py-0"
            >
              <v-row no-gutters>
                <v-col>
                  <span class="subtitle-2">{{ getPropertyLabelById(groupId) }}</span>
                </v-col>
                <v-col cols="auto">
                  <v-badge
                    color="accent"
                    :content="getGroupedMetadata[groupId].length"
                    inline
                  />
                </v-col>
              </v-row>
            </v-expansion-panel-header>

            <v-expansion-panel-content class="pt-4">
              <div
                v-for="custom in getGroupedMetadata[groupId]"
                :key="custom.value"
              >
                <v-row align="center">
                  <v-col>
                    <ChooseCreateTitle
                      v-if="custom.value === 'vdi:Title'"
                      :key="custom.value"
                      :object-uuid="object.uuid"
                      propclass="vdi:Title"
                      proprelation="vdi:has-title"
                      :required="custom.required"
                      :label="true"
                    />
                    <ChooseTaxonomyNodes
                      v-else-if="custom.hasTaxonomyRole"
                      :object-uuid="object.uuid"
                      :propclass="custom.value"
                      :proprelation="custom.rel"
                      :required="custom.required"
                      :multiple="custom.multiple"
                      :label="true"
                      :icon="custom.icon"
                    />
                    <ChooseCreateProperty
                      v-else-if="custom.type === 'plus:Class'"
                      :key="custom.value"
                      :object-uuid="object.uuid"
                      :propclass="custom.value"
                      :proprelation="custom.rel"
                      :required="custom.required"
                      :multiple="custom.multiple"
                      :label="true"
                      :icon="custom.icon"
                    />
                    <ChooseManageList
                      v-else-if="custom.type === 'plus:Array'"
                      :key="custom.value"
                      :object-uuid="object.uuid"
                      :proplist="custom.value"
                      :required="custom.required"
                      :label="true"
                      :icon="custom.icon"
                    />
                    <ShowEditMetadata
                      v-else
                      :key="custom.value"
                      :object-uuid="object.uuid"
                      :proprelation="custom.rel"
                      :required="custom.required"
                      :label="true"
                      :icon="custom.icon"
                    />
                  </v-col>
                  <v-col v-if="custom.tooltip" cols="auto">
                    <v-tooltip top>
                      <template v-slot:activator="{ on: tooltip }">
                        <v-icon
                          class="cursor-pointer mb-1"
                          right
                          v-on="tooltip"
                        >
                          mdi-information-outline
                        </v-icon>
                      </template>
                      <div v-html="custom.tooltip" />
                    </v-tooltip>
                  </v-col>
                </v-row>
              </div>
            </v-expansion-panel-content>
          </v-expansion-panel>
        </v-expansion-panels>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
import { mapGetters, mapActions } from "vuex";

import match from "@/util/match";

import PreviewPDF from "@/shared/block/PreviewPDF";
import ChooseCreateProperty from "@/toolkit/inline/OtkChooseCreateProperty";
import ChooseTaxonomyNodes from "@/toolkit/inline/OtkChooseTaxonomyNodes";
import ChooseManageList from "@/toolkit/inline/OtkChooseManageList";
import ChooseCreateTitle from "@/toolkit/inline/OtkChooseCreateTitle";
import ShowEditMetadata from "@/toolkit/inline/OtkShowEditMetadata";

export default {
    name: "PlusAssignMetadataToObject",
    components: {
        PreviewPDF,
        ChooseCreateProperty,
        ChooseTaxonomyNodes,
        ChooseCreateTitle,
        ChooseManageList,
        ShowEditMetadata
    },
    props: {
        object: {
            type: Object,
            required: true
        }
    },
    data() {
        return {
            objectMetadata: [],
            activeGroups: []
        };
    },
    computed: {
        getMetadataOrderedGroups() {
            return Object.keys(this.getGroupedMetadata).sort((a,b) => {
                const posA = this.getPropertyAttributeById(a, "plus:metaListPriority") || 99;
                const posB = this.getPropertyAttributeById(b, "plus:metaListPriority") || 99;
                const labelA = this.getPropertyLabelById(a) || a;
                const labelB = this.getPropertyLabelById(b) || b;
                return posA - posB || labelA.localeCompare(labelB);
            });
        },
        getGroupedMetadata() {
            const groups = {};
            this.getVisibleMetadata.forEach((entry) => {
                let group = this.getPropertyRelationById(entry.value, "plus:is-part-of-metadata-group")[0];
                if (!group) {
                    if (!groups["plus:Meta"]){
                        groups["plus:Meta"] = [];
                    }
                    groups["plus:Meta"].push(entry);
                } else {
                    if (!groups[group]){
                        groups[group] = [];
                    }
                    groups[group].push(entry);
                }
            });
            return groups;
        },
        getVisibleMetadata() {
            return this.objectMetadata
                .map((prop) => {
                    const relation = this.getPropertyRelationById(prop.identifier, "plus:has-relations")[0] || prop.identifier;
                    const required = this.isRequired(prop.identifier);
                    const single = this.getPropertyRelationById(prop.identifier, "plus:has-roles").includes("plus:SingleMetadata");
                    const icon = this.getPropertyRelationById(prop.identifier, "plus:has-icons")[0];
                    const position = this.getPropertyAttributeById(prop.identifier, "plus:metaListPriority") || 99;
                    const hasTaxonomyRole = this.hasTaxonomyRole(prop.identifier);
                    const tooltip = this.getPropertyAttributeById(prop.identifier, "plus:tooltipInfo")?.[this.$store["settings/getCurrentLocale"]] ?? null;

                    return {
                        value: prop.identifier,
                        text: this.getPropertyLabelById(prop.identifier),
                        type: prop.datatype,
                        required: required,
                        multiple: !single,
                        rel: relation,
                        position,
                        hasTaxonomyRole,
                        icon: (icon) ? icon.replace(":", "-") : undefined,
                        tooltip
                    };
                })
                .sort((a,b) => a.position - b.position || a.text.localeCompare(b.text));
        },
        isPDF() {
            return match.mimeType(this.$store, this.object.source.type, this.object.source.name) === "application/pdf" &&
            (this.object.source.uri || this.object.source.data);
        },
        ...mapGetters("projects", [
            "getCurrentProjectRelationById"
        ]),
        ...mapGetters("settings", [
            "getSetting"
        ]),
        ...mapGetters("storage", [
            "getMetadataValueByURI"
        ]),
        ...mapGetters("properties", [
            "isRequired",
            "getPropertyById",
            "getPropertyRelationById",
            "getPropertiesByRole",
            "getPropertyLabelById",
            "getPropertyAttributeById"
        ])
    },
    created() {
        this.objectMetadata.push(...this.getPropertiesByRole("plus:AssignableMetadata"));
        this.setDefaultOpenGroups();
    },
    methods: {
        simpleAssign(uuid, {event, uri}) {
            this.saveMetaDatum({
                objectUuid: uuid,
                objectMeta: {
                    uri,
                    provenance: "User",
                    confidence: 1,
                    value: event
                }
            });
        },
        setDefaultOpenGroups() {
            this.getMetadataOrderedGroups.forEach((groupId, index) => {
                if (this.getPropertyAttributeById(groupId, "plus:openByDefault")) {
                    this.activeGroups.push(index);
                }
            });
            if (this.activeGroups.length === 0) this.activeGroups.push(0);
        },
        hasTaxonomyRole(prop) {
            return this.getPropertyRelationById(prop, "plus:has-roles").includes("plus:TaxonomyTree") ||
                this.getPropertyRelationById(prop, "plus:has-roles").includes("plus:Hierarchy");
        },
        ...mapActions("storage", [
            "addMetadata",
            "updateMetadata",
            "saveMetaDatum",
            "saveObjectLocal"
        ])
    }
};
</script>
