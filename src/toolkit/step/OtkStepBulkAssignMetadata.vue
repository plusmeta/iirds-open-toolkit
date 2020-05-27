<!--
 * iiRDS Open Toolkit
 * Copyright 2020 plusmeta GmbH
 * License: MIT
-->

<template>
  <v-container fluid>
    <HelpView helpkey="workflow.assignMetadata" />

    <v-card :outlined="!$vuetify.theme.dark">
      <v-data-iterator
        :items="getCurrentObjects"
        :items-per-page="10"
        :search="search"
        :footer-props="{
          'items-per-page-options': [10,25,50],
          'show-first-last-page': true,
          'show-current-page': true
        }"
        must-sort
        sort-by="name"
        item-key="uuid"
      >
        <template v-slot:header>
          <v-toolbar :class="{'elevation-0': !$vuetify.theme.dark}">
            <v-flex
              v-shortkey.once="['t']"
              class="pb-2"
              @shortkey="$refs.type.focus()"
            >
              <v-autocomplete
                ref="type"
                :value="getSetting('ui_assign_filter')"
                :items="getObjectTypeFilterValues"
                :label="$t('Objects.all')"
                prepend-icon="mdi-filter"
                single-line
                hide-details
                clearable
                @change="setLocalSetting({key: 'ui_assign_filter', value: $event})"
              >
                <template v-slot:item="{ item }">
                  <span>{{ item.text }} </span>
                  <v-spacer />
                  <v-chip small color="accent">
                    {{ item.count }}
                  </v-chip>
                </template>
              </v-autocomplete>
            </v-flex>

            <v-spacer />

            <v-flex
              v-shortkey.once="['f']"
              class="pb-2"
              @shortkey="$refs.search.focus()"
            >
              <v-text-field
                ref="search"
                v-model="search"
                prepend-icon="mdi-magnify"
                :label="$t('Common.search')"
                single-line
                hide-details
                clearable
              />
            </v-flex>

            <v-spacer />

            <div
              v-shortkey.once="['s']"
              @shortkey="showSettingsMenu = !showSettingsMenu"
            >
              <v-menu
                v-model="showSettingsMenu"
                left
                offset-y
                :min-width="350"
                :close-on-content-click="false"
              >
                <template v-slot:activator="{ on }">
                  <v-btn
                    icon
                    class="mr-1"
                    v-on="on"
                  >
                    <v-icon :class="{turn: showSettingsMenu}">
                      mdi-cog
                    </v-icon>
                  </v-btn>
                </template>
                <v-list>
                  <v-subheader>
                    {{ $t('Common.view') }}
                    <v-divider />
                  </v-subheader>

                  <v-list-item>
                    <v-list-item-action>
                      <v-switch
                        :input-value="getSetting('ui_assign_preview')"
                        flat
                        color="primary"
                        @change="setLocalSetting({key: 'ui_assign_preview', value: !!$event})"
                      />
                    </v-list-item-action>
                    <v-list-item-title>{{ $t('Common.preview') }}</v-list-item-title>
                  </v-list-item>
                </v-list>
              </v-menu>
            </div>
          </v-toolbar>
        </template>

        <template v-slot:default="{ items, isExpanded, expand }">
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
      <v-container
        v-if="getSetting('ui_shortcuts')"
        class="caption grey--text text-sm-right px-0 pt-6"
      >
        <v-icon class="mr-4" color="grey darken-1">
          mdi-keyboard
        </v-icon>
        <span class="d-inline-block mr-2">
          {{ $t("Common.filter") }}
        </span>
        <kbd>t</kbd>
        <span class="d-inline-block mr-2 ml-8">
          {{ $t("Common.search") }}
        </span>
        <kbd>f</kbd>
        <span class="d-inline-block mr-2 ml-8">
          {{ $t("Actions.openSettings") }}
        </span>
        <kbd>s</kbd>
      </v-container>
    </v-card>
  </v-container>
</template>

<script>
import { mapGetters, mapActions } from "vuex";

import util from "@/util";

import AssignMetadata from "@/toolkit/block/OtkAssignMetadataToObject";
import DeleteObject from "@/shared/inline/DeleteObject";
import HelpView from "@/shared/block/HelpView";

export default {
    name: "OtkStepBulkAssignMetadata",
    components: {
        AssignMetadata,
        DeleteObject,
        HelpView
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
            "getMetadataByURI"
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
        document.querySelector("#item-0").click();
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
