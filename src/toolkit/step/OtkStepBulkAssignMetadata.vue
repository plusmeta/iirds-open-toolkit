<!--
 * iiRDS Validation Tool
 * Copyright 2020 plusmeta GmbH
 * License: MIT
-->

<template>
  <v-container fluid>
    <v-card
      class="mb-6"
      min-height="100"
      :color="(isValid) ? 'success' : 'error'"
      :outlined="!$vuetify.theme.dark"
    >
      <v-card-title class="h4">
        <v-icon left x-large>
          {{ (isValid) ? 'mdi-check-circle' : 'mdi-close-circle' }}
        </v-icon>
        <span class="h1">
          {{ (isValid) ? 'Valid' : 'Not valid' }}
        </span>
        <v-spacer />
        <span class="title">
          iiRDS 1.0
        </span>
      </v-card-title>
      <v-card-text>
        There were <span class="font-weight-bold">{{ getViolations }}</span>
        violations for file <span class="font-weight-bold">{{ getValidationSource }}</span> detected
      </v-card-text>
    </v-card>

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
                    {{ getIconForType(item.uuid) }}
                  </v-icon>
                </v-list-item-icon>
                <v-list-item-content>
                  <v-list-item-title class="subtitle-2">
                    {{ item.name }}
                  </v-list-item-title>
                  <v-list-item-subtitle class="caption">
                    <span class="font-monospace font-weight-bold">
                      {{ getMetadataValueByURI(item.uuid, "plus:OriginalFileName") }}:{{ getMetadataValueByURI(item.uuid, "plus:LineNr") }}
                    </span>
                  </v-list-item-subtitle>
                </v-list-item-content>
                <v-list-item-action>
                  <v-chip small color="primary">
                    {{ getMetadataValueByURI(item.uuid, 'plus:Rule') }}
                  </v-chip>
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

import AssignMetadata from "@/toolkit/block/OtkAssignMetadataToObject";

export default {
    name: "OtkStepBulkAssignMetadata",
    components: {
        AssignMetadata,
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
        getViolations() {
            return this.getCurrentObjectsByType(this.objecttype).filter((o) => {
                return this.getMetadataValueByURI(o.uuid, "plus:Level") === "MUST";
            }).length;
        },
        isValid() {
            return this.getViolations.length === 0;
        },
        getValidationSource() {
            return this.getCurrentObjectsByType("iirds:Container")[0].name;
        },
        getCurrentObjects() {
            let filter = this.getSetting("ui_assign_filter");
            return this.getCurrentObjectsByType(this.objecttype).filter((object) => {
                const ruleNr = this.getMetadataValueByURI(object.uuid, "plus:Rule");
                return (filter) ? ruleNr === filter : true;
            });
        },
        getObjectTypeFilterValues() {
            const ruleCountMap = this.getCurrentObjectsByType(this.objecttype).reduce((map, object) => {
                const ruleNr = this.getMetadataValueByURI(object.uuid, "plus:Rule");
                if (map[ruleNr]) {
                    map[ruleNr]++;
                } else {
                    map[ruleNr] = 1;
                }
                return map;
            }, {});

            return Object.entries(ruleCountMap).map(([rule, count]) => {
                return {
                    text: rule,
                    value: rule,
                    count: count
                };
            }).sort((a,b) => a.text.localeCompare(b.text));
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
        const firstElem = document.querySelector("#item-0");
        if (firstElem) firstElem.click();
    },
    methods: {
        getIconForType(objectUuid) {
            return "mdi-close-circle";
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
