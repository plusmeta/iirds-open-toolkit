<!-- eslint-disable vue/no-v-html -->
<template>
  <v-card
    class="mb-4 elevation-2"
    color="primary"
    dark
    outlined
  >
    <v-card-title class="pl-6">
      <span class="text-h6">
        {{ $t("Files.guidelines") }}
        <v-tooltip top>
          <template v-slot:activator="{ on }">
            <v-icon
              class="cursor-pointer mb-1"
              right
              v-on="on"
            >
              mdi-information-outline
            </v-icon>
          </template>
          <span>{{ $t("Public.guidelines") }}</span>
        </v-tooltip>
      </span>
      <v-spacer />
      <v-btn
        icon
        @click="$emit('hide')"
      >
        <v-icon>mdi-close</v-icon>
      </v-btn>
    </v-card-title>
    <v-card-text class="px-6 pb-8">
      <v-row>
        <v-col
          v-for="guideline in getGuidelines"
          :key="guideline.id"
        >
          <v-row dense>
            <v-col class="pb-0" offset="2">
              <span class="overline">
                {{ guideline.text }}
              </span>
            </v-col>
          </v-row>
          <v-row class="mr-4" dense>
            <v-col cols="2">
              <v-icon class="float-right mr-2">
                {{ guideline.icon }}
              </v-icon>
            </v-col>
            <v-col>
              <span
                style="white-space: pre-line;"
                v-html="guideline.value"
              />
            </v-col>
          </v-row>
        </v-col>
      </v-row>
    </v-card-text>
  </v-card>
</template>

<script>
import { mapGetters } from "vuex";

export default {
    name: "BlockAssignGuidelines",
    computed: {
        getGuidelines() {
            return Object.keys(this.getCurrentProjectRelations)
                .filter((rel) => {
                    let prop = this.getPropertyById(rel);
                    if (prop?.rels) {
                        let roles = this.getPropertyRelationById(rel, "plus:has-roles");
                        return roles.includes("plus:EquipmentMetadata");
                    }
                    return false;
                })
                .map(rel => this.getPropertyById(rel))
                .map(prop => this.transformMetadata(prop))
                .sort((a, b) => a?.text?.localeCompare(b?.text))
                .sort((a, b) => a.position - b.position);
        },
        ...mapGetters("projects", [
            "getCurrentProjectRelationById",
            "getCurrentProjectRelations"
        ]),
        ...mapGetters("properties", [
            "getPropertyLabelById",
            "getPropertyRelationById",
            "getPropertyAttributeById",
            "getPropertyIcon",
            "isProperty",
            "getPropertyById"
        ]),
        ...mapGetters("settings", [
            "getCurrentLocale"
        ])
    },
    methods: {
        transformMetadata(property) {
            let id = property.identifier;
            const position = this.getPropertyAttributeById(id, "plus:guidelineListPriority") || 99;
            const icon = this.getPropertyIcon(id);

            return {
                id,
                value: this.getCurrentProjectRelationById(id),
                text: this.getPropertyLabelById(id),
                type: property.datatype,
                position,
                icon
            };
        }
    }
};
</script>
