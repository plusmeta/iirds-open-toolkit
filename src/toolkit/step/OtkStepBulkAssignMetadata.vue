<!--
 * VDI 2770 Open Toolkit
 * Copyright 2022 plusmeta GmbH
 * License: MIT
-->

<template>
  <v-container fluid>
    <HelpView helpkey="workflow.assignMetadata" />
    <AssignGuidelines />

    <v-card :outlined="!$vuetify.theme.dark">
      <v-data-iterator
        :items="getCurrentObjects"
        :items-per-page="10"
        :search="search"
        must-sort
        sort-by="name"
        item-key="uuid"
      >
        <template v-slot="{ items, isExpanded, expand }">
          <v-card
            v-for="(item, index) in items"
            :key="item.uuid"
            flat
            tile
          >
            <v-divider />
            <v-list class="pa-0">
              <v-list-item
                :id="`item-${index}`"
                :input-value="isExpanded(item)"
                @click="expand(item, !isExpanded(item))"
              >
                <v-list-item-icon>
                  <v-icon>
                    {{ getIconForType(item.type) }}
                  </v-icon>
                </v-list-item-icon>
                <v-list-item-content>
                  <v-list-item-title class="subtitle-2">
                    {{ item.name }}
                  </v-list-item-title>
                  <v-list-item-subtitle class="overline">
                    {{ getPropertyLabelById(item.type) }}
                  </v-list-item-subtitle>
                </v-list-item-content>
                <v-list-item-action>
                  <DeleteObject :uuid="item.uuid" />
                </v-list-item-action>
              </v-list-item>
            </v-list>
            <v-card-text
              v-if="isExpanded(item)"
              class="pl-8 pr-6"
            >
              <AssignMetadata :object="item" />
            </v-card-text>
          </v-card>
          <v-divider />
        </template>
      </v-data-iterator>
    </v-card>
  </v-container>
</template>

<script>
import { mapGetters, mapActions } from "vuex";

import AssignMetadata from "@/toolkit/block/OtkAssignMetadataToObject";
import DeleteObject from "@/shared/inline/DeleteObject";
import HelpView from "@/shared/block/HelpView";
import AssignGuidelines from "@/shared/block/AssignGuidelines";

export default {
    name: "OtkStepBulkAssignMetadata",
    components: {
        AssignMetadata,
        DeleteObject,
        HelpView,
        AssignGuidelines
    },
    props: {
        objecttype: {
            type: Array,
            default: () => []
        }
    },
    data() {
        return {
            search: null,
            removing: "",
            showSettingsMenu: false
        };
    },
    computed: {
        getCurrentObjects() {
            let filter = this.getSetting("ui_assign_filter") || this.objecttype;
            return this.getCurrentObjectsByType(filter);
        },
        getObjectTypeFilterValues() {
            return Object.entries(this.getCurrentObjectTypes).map(([key, value]) => {
                return {
                    text: this.getPropertyLabelById(key) || key,
                    value: key,
                    count: value
                };
            })
                .filter(item => this.objecttype.includes(item.value))
                .sort((a,b) => a.text.localeCompare(b.text));
        },
        ...mapGetters("storage", [
            "getCurrentObjectTypes",
            "getCurrentObjectsByType",
            "getMetadataValueByURI",
            "getMetadataByURI",
            "countInvalidObjects"
        ]),
        ...mapGetters("properties", [
            "getPropertyLabelById",
            "getPropertyRelationById",
            "getPropertiesByRole",
            "getPropertyType"
        ]),
        ...mapGetters("projects", [
            "getCurrentProjectRelationById"
        ]),
        ...mapGetters("settings", [
            "getCurrentProjectUuid",
            "getSetting"
        ])
    },
    mounted() {
        // open first element after mount
        const firstElem = document.querySelector("#item-0");
        if (firstElem) firstElem.click();
    },
    methods: {
        getIconForType(type) {
            const icon = this.getPropertyRelationById(type, "plus:has-icons")[0];
            return (icon) ? icon.replace(":", "-") : undefined;
        },
        ...mapActions("projects", [
            "updateCurrentProjectRelations",
            "deleteObjectsFromProject"
        ]),
        ...mapActions("settings", [
            "setLocalSetting"
        ]),
        ...mapActions("storage", [
            "saveMetaDatum"
        ])
    }
};
</script>

<style>
.stepborder {
  border-left: 1px solid #ddd;
}
.v-chip--disabled {
    opacity: 0.8;
    pointer-events: none;
    -webkit-user-select: none;
    -moz-user-select: none;
    -ms-user-select: none;
    user-select: none;
}
.theme--dark.v-select .v-chip--disabled, .theme--dark.v-select .v-select__selection--disabled {
    color: rgba(255, 255, 255, 0.8);
}
</style>
