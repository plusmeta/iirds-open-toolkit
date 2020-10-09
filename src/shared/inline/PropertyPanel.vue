<!--
  Copyright 2020 plusmeta GmbH
  License: MIT
-->

<template>
  <v-menu
    v-model="panel"
    transition="scale-transition"
    :close-on-content-click="false"
  >
    <template #activator="{ on }">
      <v-chip
        small
        :close="close"
        @click:close="data.parent.selectItem(data.item)"
        v-on="on"
      >
        <template v-if="isProp">
          <span class="truncate-200">{{ getPropertyLabelById(property.identifier) || property.identifier }}</span>
        </template>
        <template v-else>
          <v-icon small left>
            mdi-link-off
          </v-icon>
          <span class="truncate-200 font-monospace">{{ getValue }}</span>
        </template>
      </v-chip>
    </template>
    <v-card max-width="400">
      <v-list class="pa-0">
        <v-list-item :input-value="true">
          <v-list-item-icon>
            <v-icon v-if="isProp" x-large>
              {{ icon }}
            </v-icon>
            <v-icon v-else x-large>
              mdi-help-box
            </v-icon>
          </v-list-item-icon>
          <v-list-item-content>
            <v-list-item-title class="text-subtitle-2">
              {{ (isProp) ? getPropertyLabelById(property.identifier) : property.identifier }}
            </v-list-item-title>
            <v-list-item-subtitle
              v-if="isProp"
              class="overline"
            >
              {{ getPropertyLabelById(property.subClassOf) }} &bull;
              {{ getPropertyLabelById(property.datatype) }}
              <v-text-field
                :value="getValue"
                class="font-monospace-input pt-0"
                :readonly="!isCustom"
                @change="changeIRI"
              />
            </v-list-item-subtitle>
          </v-list-item-content>
        </v-list-item>
      </v-list>
    </v-card>
  </v-menu>
</template>

<script>
import { mapGetters, mapActions } from "vuex";

import util from "@/util";

export default {
    name: "PropertyPanel",
    props: {
        data: {
            type: Object,
            required: true
        },
        close: {
            type: Boolean,
            default: true
        },
        icon: {
            type: String,
            default: "mdi-shape"
        }
    },
    data() {
        return {
            panel: false
        };
    },
    computed: {
        property() {
            return this.getPropertyById(this.getValue) ?? {
                identifier: this.getValue
            };
        },
        isProp() {
            return this.getValue && this.isProperty(this.getValue);
        },
        isCustom() {
            let roles = this.getPropertyRelationById(this.getValue, "plus:has-roles");
            return roles.includes("plus:CustomMetadata");
        },
        getValue() {
            return this.data?.item?.value;
        },
        ...mapGetters("properties", [
            "isProperty",
            "getPropertyById",
            "getPropertyLabelById",
            "getPropertyRelationById"
        ]),
        ...mapGetters("storage", [
            "getObjectByExternalId",
            "getObjectByUuid"
        ])
    },
    methods: {
        ...util,
        changeIRI(newId) {
            let oldId = this.getValue;
            if (!newId || !newId.length || !oldId || oldId === newId) return;
            // deselect current item with old identifier
            this.data.parent.selectItem(this.data.item);
            // change property in storage
            this.changePropertyId({newId, oldId});
            // select property with new identifier
            this.data.parent.selectItem({
                text: this.getPropertyLabelById(newId),
                value: newId
            });

        },
        ...mapActions("properties", [
            "changePropertyId"
        ])
    }
};
</script>
