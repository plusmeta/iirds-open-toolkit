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
    <template v-slot:activator="{ on }">
      <v-chip
        small
        :disabled="disabled"
        :close="close && !disabled"
        @click:close="data.parent.selectItem(data.item)"
        v-on="on"
      >
        <template v-if="isProperty(getValue)">
          <span class="truncate-200">{{ getPropertyLabelById(property.identifier) || property.identifier }}</span>
        </template>
        <template v-else-if="isObject(getValue)">
          <span class="truncate-200">{{ getObject(getValue).name }}</span>
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
      <v-list color="secondary lighten-1" class="pa-0">
        <v-list-item :input-value="true">
          <v-list-item-icon>
            <v-icon v-if="isProperty(getValue)" x-large>
              mdi-shape
            </v-icon>
            <v-icon v-else-if="isObject(getValue)" x-large>
              mdi-database
            </v-icon>
            <v-icon v-else x-large>
              mdi-help-box
            </v-icon>
          </v-list-item-icon>
          <v-list-item-content>
            <v-list-item-title
              v-if="isProperty(getValue)"
              class="subtitle-2"
            >
              {{ getPropertyLabelById(property.identifier) || property.identifier }}
            </v-list-item-title>
            <v-list-item-title
              v-if="isObject(getValue)"
              class="subtitle-2 "
            >
              {{ getObject(getValue).name }}
            </v-list-item-title>
            <v-list-item-subtitle
              v-if="isProperty(getValue)"
              class="overline"
              style="color: white"
            >
              {{ getPropertyLabelById(property.subClassOf) }} &bull;
              {{ getPropertyLabelById(property.datatype) }}
            </v-list-item-subtitle>
            <v-list-item-subtitle
              v-if="isObject(getValue)"
              class="overline"
              style="color: white"
            >
              {{ getPropertyLabelById(getObject(getValue).type) }}
            </v-list-item-subtitle>
            <v-list-item-subtitle
              v-if="isProperty(getValue)"
              class="font-monospace mt-1"
            >
              {{ getValue }}
            </v-list-item-subtitle>
            <v-list-item-subtitle
              v-if="isObject(getValue)"
              class="font-monospace mt-1"
            >
              {{ getObjectSourceName(getValue) }}
            </v-list-item-subtitle>
          </v-list-item-content>
        </v-list-item>
      </v-list>
    </v-card>
  </v-menu>
</template>

<script>
import { mapGetters } from "vuex";

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
        disabled: {
            type: Boolean,
            default: false
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
        getValue() {
            return this.data?.item?.value;
        },
        ...mapGetters("properties", [
            "isProperty",
            "getPropertyById",
            "getPropertyLabelById"
        ]),
        ...mapGetters("storage", [
            "getObjectByExternalId",
            "getObjectByUuid"
        ])
    },
    methods: {
        isObject(target) {
            let external = this.getObjectByExternalId(target);
            let internal = this.getObjectByUuid(target);
            return !!external || !!internal;
        },
        getObject(uuid) {
            return this.getObjectByUuid(uuid) || {};
        },
        getObjectSourceName(uuid) {
            return this.getObject(uuid)?.source?.name ?? this.$t("Objects.noAssociatedFile");
        }
    }
};
</script>
