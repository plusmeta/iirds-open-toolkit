<!--
  Copyright 2020 plusmeta GmbH
  License: MIT
-->

<template>
  <v-menu
    v-model="panel"
    left
    offset-y
    transition="scale-transition"
    :close-on-content-click="false"
  >
    <template v-slot:activator="{ on }">
      <v-btn
        fab
        small
        color="success"
        class="elevation-0"
        :loading="creating"
        v-on="on"
      >
        <v-icon>mdi-plus</v-icon>
      </v-btn>
    </template>
    <v-card
      :min-width="450"
      class="pa-0 d-flex flex-column flex-grow-1 elevation-12"
    >
      <v-form @submit.prevent="addMetadata">
        <v-list class="pa-0">
          <v-list-item>
            <v-list-item-icon>
              <v-icon x-large>
                mdi-tag-plus
              </v-icon>
            </v-list-item-icon>
            <v-list-item-content>
              <v-list-item-title class="subtitle-2">
                {{ getObjectByUuid(object).name }}
              </v-list-item-title>
              <v-list-item-subtitle class="overline grey--text">
                {{ getAvailableMetadata.length }} {{ $t("Objects.metadata") }}
              </v-list-item-subtitle>
            </v-list-item-content>
          </v-list-item>
        </v-list>
        <v-card-text>
          <v-autocomplete
            v-if="panel"
            v-model="metadata"
            :label="getPropertyLabelById('plus:AssignableMetadata')"
            :items="getAvailableMetadata"
            prepend-icon="mdi-tag"
            :multiple="false"
          >
            <template v-slot:item="{ item }">
              <v-list-item-icon>
                <v-icon :disabled="item.disabled">
                  {{ (item.icon) ? item.icon : "mdi-tag-outline" }}
                </v-icon>
              </v-list-item-icon>
              <v-list-item-content>
                {{ item.text }}
              </v-list-item-content>
              <v-list-item-action>
                <template v-if="item.restricted">
                  <v-icon left :disabled="item.disabled">
                    mdi-database-lock
                  </v-icon>
                </template>
                <template v-if="item.dependent">
                  <v-icon left :disabled="item.disabled">
                    mdi-link-lock
                  </v-icon>
                </template>
                <template v-if="item.mapped">
                  <v-icon left :disabled="item.disabled">
                    mdi-auto-fix
                  </v-icon>
                </template>
              </v-list-item-action>
            </template>
          </v-autocomplete>
        </v-card-text>
        <v-btn
          color="success"
          block
          type="submit"
          :disabled="!metadata"
        >
          {{ $t("Actions.addMetadata") }}
        </v-btn>
      </v-form>
    </v-card>
  </v-menu>
</template>

<script>
import { mapGetters, mapActions } from "vuex";

export default {
    name: "AddMetadata",
    props: {
        object: {
            type: String,
            required: true
        },
        visible: {
            type: Array,
            default: () => []
        },
        creating: {
            type: Boolean,
            default: false
        }
    },
    data () {
        return {
            panel: false,
            metadata: undefined
        };
    },
    computed: {
        ...mapGetters("properties", [
            "getPropertyById",
            "getPropertiesByRole",
            "getPropertyLabelById",
            "getPropertyRelationById"
        ]),
        ...mapGetters("storage", [
            "getObjectByUuid",
            "getMetadataValueByURI"
        ]),
        getObjectType() {
            return this.getObjectByUuid(this.object).type;
        },
        getAvailableMetadata() {
            return this.getPropertiesByRole("plus:AssignableMetadata").reduce((props, prop) => {
                const icon = this.getPropertyRelationById(prop.identifier, "plus:has-icons")[0];
                const relations = this.getPropertyRelationById(prop.identifier, "plus:has-relations")[0] || prop.identifier;
                const required = this.getPropertyRelationById(prop.identifier, "plus:has-roles").includes("plus:RequiredMetadata");
                const restrictions = this.getPropertyRelationById(prop.identifier, "plus:restricted-to-object-type");
                const dependentRelation = this.getPropertyRelationById(prop.identifier, "plus:dependent-on-relation");
                const dependentValue = this.getPropertyRelationById(prop.identifier, "plus:dependent-on-relation-target");
                const dependentMapping = this.getPropertyRelationById(prop.identifier, "plus:dependent-on-relation-mapping");

                const areRestrictionsOk = !restrictions.length || restrictions.includes(this.getObjectType);
                const areDependentValuesOk = !dependentValue.length || this.checkDependencyValue(dependentRelation, dependentValue);
                const areDependentMappingsOk = dependentMapping.length && this.checkDependencyMapping(dependentRelation);

                if (!this.visible.includes(prop.identifier) && !required) {
                    props.push({
                        value: prop.identifier,
                        text: this.getPropertyLabelById(prop.identifier),
                        type: prop.datatype,
                        icon: (icon) ? icon.replace(":", "-") : undefined,
                        rel: relations,
                        disabled: !areRestrictionsOk || !areDependentValuesOk,
                        restricted: !areRestrictionsOk,
                        dependent: !areDependentValuesOk,
                        mapped: areDependentMappingsOk
                    });
                }
                return props;
            }, []).sort((a,b) => a.text.localeCompare(b.text));;
        },
    },
    methods: {
        addMetadata() {
            this.$emit("metadata", this.getPropertyById(this.metadata));
            this.cleanUpAndClose();
        },
        cleanUpAndClose() {
            this.metadata = undefined;
            this.panel = false;
        },
        checkDependencyValue(dependentRelation, dependentValue) {
            return dependentRelation.some((rel) => {
                let assigned = this.getMetadataValueByURI(this.object, rel);
                let compare = (Array.isArray(assigned)) ? assigned : [assigned];
                return compare.filter(Boolean).some((val) => {
                    return dependentValue.includes(val);
                });
            });
        },
        checkDependencyMapping(dependentRelation) {
            return  !!this.getMetadataValueByURI(this.object, dependentRelation[0]);
        }
    }
};
</script>
