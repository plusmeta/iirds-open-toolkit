<!--
 * iiRDS Open Toolkit
 * Copyright 2020 plusmeta GmbH
 * License: MIT
-->

<template>
  <v-container fluid>
    <v-layout wrap>
      <v-flex
        v-if="isPreview"
        xs6
        lg4
        class="px2"
      >
        <PreviewPDF
          v-if="isPDF"
          :file="object"
        />
        <PreviewHTML
          v-else-if="isHTML"
          :file="object"
          :size="1"
        />
        <PreviewText
          v-else-if="isText"
          :text="object.text"
          :size="1"
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
      <v-flex
        class="flex-shrink-1"
        :class="{
          'offset-xs1': isPreview,
          'xs5': isPreview,
          'lg7': isPreview,
          'xs12': !isPreview
        }"
      >
        <v-layout row>
          <v-autocomplete
            :value="object.type"
            :items="getObjectTypes"
            :label="$t('Objects.type')"
            class="mr-6"
            filled
            @change="setObjectType"
          />
          <div class="pt-2 pr-2">
            <AddMetadata
              :object="object.uuid"
              :visible="getVisibleMetadata.map(m => m.value)"
              @metadata="addObjectMetadataField"
            />
          </div>
        </v-layout>

        <ChooseCreateTitle
          ref="title"
          :object-uuid="object.uuid"
          propclass="plus:Title"
          proprelation="iirds:title"
          :indicator="false"
          :label="true"
        />

        <template
          v-for="custom in getVisibleMetadata"
        >
          <div
            v-if="custom.type === 'plus:Class'"
            :key="custom.value"
            class="mt-2"
          >
            <ChooseCreateProperty
              :key="custom.value"
              :object-uuid="object.uuid"
              :propclass="custom.value"
              :proprelation="custom.rel"
              :required="custom.required"
              :multiple="custom.multiple"
              :indicator="false"
              :label="true"
              :icon="custom.icon"
            />
          </div>
        </template>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
import { mapGetters, mapActions } from "vuex";

import util from "@/util";
import match from "@/util/match";

import PreviewText from "@/shared/block/PreviewText";
import PreviewPDF from "@/shared/block/PreviewPDF";
import PreviewHTML from "@/shared/block/PreviewHTML";
import AddMetadata from "@/shared/inline/AddMetadata";
import ChooseCreateProperty from "@/toolkit/inline/OtkChooseCreateProperty";
import ChooseCreateTitle from "@/toolkit/inline/OtkChooseCreateTitle";

export default {
    name: "PlusAssignMetadataToObject",
    components: {
        PreviewText,
        PreviewPDF,
        PreviewHTML,
        ChooseCreateProperty,
        ChooseCreateTitle,
        AddMetadata
    },
    props: {
        object: {
            type: Object,
            required: true
        }
    },
    data() {
        return {
            objectMetadata: []
        };
    },
    computed: {
        isPreview() {
            return !!this.getSetting("ui_assign_preview");
        },
        getVisibleMetadata() {
            return this.objectMetadata
                .filter((prop) => {
                    const restrictions = this.getPropertyRelationById(prop.identifier, "plus:restricted-to-object-type");
                    const areRestrictionsOk = !restrictions.length || restrictions.includes(this.object.type);
                    return areRestrictionsOk;
                })
                .map((prop) => {
                    const relation = this.getPropertyRelationById(prop.identifier, "plus:has-relations")[0] || prop.identifier;
                    const required = this.getPropertyRelationById(prop.identifier, "plus:has-roles").includes("plus:RequiredMetadata");
                    const single = this.getPropertyRelationById(prop.identifier, "plus:has-roles").includes("plus:SingleMetadata");
                    const icon = this.getPropertyRelationById(prop.identifier, "plus:has-icons")[0];
                    return {
                        value: prop.identifier,
                        text: this.getPropertyLabelById(prop.identifier),
                        type: prop.datatype,
                        required: required,
                        multiple: !single,
                        rel: relation,
                        icon: (icon) ? icon.replace(":", "-") : undefined
                    };
                })
                .sort((a,b) => (a.required) ? -1 : 1); // Pflichtmetadaten vorne sortieren
        },
        getObjectTypes() {
            return ["plus:Document", "plus:Component", "plus:Fragment"].map((type) => {
                return {
                    text: this.getPropertyLabelById(type),
                    value: type
                };
            });
        },
        isPDF() {
            return match.mimeType(this.$store, this.object.source.type, this.object.source.name) === "application/pdf" &&
            (this.object.source.uri || this.object.source.data);
        },
        isHTML() {
            return match.mimeType(this.$store, this.object.source.type, this.object.source.name) === "text/html" &&
            (this.object.source.uri || this.object.source.data);
        },
        isText() {
            return this.object.type === "plus:Text" || this.object.source.type === "text/xml";
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
            "getPropertyById",
            "getPropertyRelationById",
            "getPropertiesByRole",
            "getPropertyLabelById",
            "getPropertyRelationById"
        ])
    },
    created() {
        this.objectMetadata.push(...this.getPropertiesByRole("plus:VisibleMetadata"));
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
        setObjectType(type) {
            this.saveObjectLocal({
                uuid: this.object.uuid,
                type: type
            });
        },
        checkDependencyValue(dependentRelation, dependentValue) {
            return dependentRelation.some((rel) => {
                let assigned = this.getMetadataValueByURI(this.object.uuid, rel);
                let compare = (Array.isArray(assigned)) ? assigned : [assigned];
                return compare.filter(Boolean).some((val) => {
                    return dependentValue.includes(val);
                });
            });
        },
        checkDependencyMapping(dependentRelation) {
            return  !!this.getMetadataValueByURI(this.object.uuid, dependentRelation[0]);
        },
        addObjectMetadataField(metadata) {
            this.objectMetadata.push(metadata);
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
