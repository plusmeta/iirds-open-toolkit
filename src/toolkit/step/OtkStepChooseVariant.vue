<!--
 * iiRDS Open Toolkit
 * Copyright 2020 plusmeta GmbH
 * License: MIT
-->

<template>
  <v-container
    v-shortkey.once="['u']"
    fluid
    @dragover.prevent="showOverlay"
    @drop.prevent="dropFile"
    @shortkey="$refs.fileInput.click()"
  >
    <HelpView helpkey="workflow.chooseVariant" />

    <v-container fluid class="drop-overlay drop-overlay-container">
      <v-card class="mb-4 mx-auto" max-width="800">
        <v-card-title>
          <v-icon left>
            mdi-file-code
          </v-icon>
          iiRDS-Variante
        </v-card-title>
        <v-card-text>
          <v-radio-group
            v-model="iirdsVariant"
            row
            @change="toggleVariantSettings"
          >
            <v-radio
              label="iiRDS"
              value="iirds"
            />
            <v-radio
              label="iiRDS/A"
              value="A"
            />
            <v-radio
              label="iiRDS/H"
              value="H"
            />
          </v-radio-group>

          <v-expand-transition>
            <div v-if="iirdsVariant === 'H'" class="mt-4">
              <v-row align="center">
                <v-col>
                  <v-text-field
                    v-model="companyName"
                    class="required"
                    prepend-icon="mdi-factory"
                    :label="$t('Common.organisation')+'*'"
                    :rules="[isNotEmpty]"
                  />
                </v-col>
                <v-col
                  v-if="getPropertyTooltip('plus:Organisation')"
                  cols="auto"
                >
                  <v-tooltip top>
                    <template v-slot:activator="{ on: tooltip }">
                      <v-icon
                        class="cursor-pointer"
                        right
                        v-on="tooltip"
                      >
                        mdi-information-outline
                      </v-icon>
                    </template>
                    <div
                      class="tooltip-width"
                      v-html="getPropertyTooltip('plus:Organisation')"
                    />
                  </v-tooltip>
                </v-col>
              </v-row>
              <v-row align="center">
                <v-col>
                  <v-text-field
                    v-model="domain"
                    :label="$t('Common.domain')+'*'"
                    class="required"
                    prepend-icon="mdi-web"
                    :rules="[isNotEmpty, isURL]"
                  />
                </v-col>
                <v-col
                  v-if="getPropertyTooltip('iirds:IdentityDomain')"
                  cols="auto"
                >
                  <v-tooltip top>
                    <template v-slot:activator="{ on: tooltip }">
                      <v-icon
                        class="cursor-pointer"
                        right
                        v-on="tooltip"
                      >
                        mdi-information-outline
                      </v-icon>
                    </template>
                    <div
                      class="tooltip-width"
                      v-html="getPropertyTooltip('iirds:IdentityDomain')"
                    />
                  </v-tooltip>
                </v-col>
              </v-row>
              <v-row align="center">
                <v-col>
                  <v-text-field
                    v-model="productType"
                    :label="$t('Common.productType')+'*'"
                    class="required"
                    prepend-icon="mdi-memory"
                    :rules="[isNotEmpty]"
                  />
                </v-col>
                <v-col
                  v-if="getPropertyTooltip('iirds:ProductType')"
                  cols="auto"
                >
                  <v-tooltip top>
                    <template v-slot:activator="{ on: tooltip }">
                      <v-icon
                        class="cursor-pointer"
                        right
                        v-on="tooltip"
                      >
                        mdi-information-outline
                      </v-icon>
                    </template>
                    <div
                      class="tooltip-width"
                      v-html="getPropertyTooltip('iirds:ProductType')"
                    />
                  </v-tooltip>
                </v-col>
              </v-row>
              <v-form-group
                :label="$t('Common.productDetails')+'*'"
              >
                <v-row align="center">
                  <v-col>
                    <v-text-field
                      ref="objectTypeURIField"
                      v-model="objectTypeURI"
                      :label="$t('Common.objectTypeUri')"
                      class="required"
                      prepend-icon="mdi-qrcode-scan"
                      :rules="[atLeastOneProductDetailForObjectType, isURL]"
                    />
                  </v-col>
                  <v-col
                    v-if="getPropertyTooltip('iirds:ObjectTypeURI')"
                    cols="auto"
                  >
                    <v-tooltip top>
                      <template v-slot:activator="{ on: tooltip }">
                        <v-icon
                          class="cursor-pointer"
                          right
                          v-on="tooltip"
                        >
                          mdi-information-outline
                        </v-icon>
                      </template>
                      <div
                        class="tooltip-width"
                        v-html="getPropertyTooltip('iirds:ObjectTypeURI')"
                      />
                    </v-tooltip>
                  </v-col>
                </v-row>
                <v-row align="center">
                  <v-col>
                    <v-text-field
                      ref="objectInstanceUriField"
                      v-model="objectInstanceUri"
                      :label="$t('Common.objectInstanceUri')"
                      class="required"
                      prepend-icon="mdi-qrcode-scan"
                      :rules="[atLeastOneProductDetailForObjectInstance, isURL]"
                    />
                  </v-col>
                  <v-col
                    v-if="getPropertyTooltip('iirds:ObjectInstanceURI')"
                    cols="auto"
                  >
                    <v-tooltip top>
                      <template v-slot:activator="{ on: tooltip }">
                        <v-icon
                          class="cursor-pointer"
                          right
                          v-on="tooltip"
                        >
                          mdi-information-outline
                        </v-icon>
                      </template>
                      <div
                        class="tooltip-width"
                        v-html="getPropertyTooltip('iirds:ObjectInstanceURI')"
                      />
                    </v-tooltip>
                  </v-col>
                </v-row>
                <v-row align="center">
                  <v-col>
                    <v-text-field
                      ref="serialNumberField"
                      v-model="serialNumber"
                      :label="$t('Common.serialNumber')"
                      class="required"
                      prepend-icon="mdi-counter"
                      :rules="[atLeastOneProductDetailForSerial]"
                    />
                  </v-col>
                  <v-col
                    v-if="getPropertyTooltip('iirds:SerialNumber')"
                    cols="auto"
                  >
                    <v-tooltip top>
                      <template v-slot:activator="{ on: tooltip }">
                        <v-icon
                          class="cursor-pointer"
                          right
                          v-on="tooltip"
                        >
                          mdi-information-outline
                        </v-icon>
                      </template>
                      <div
                        class="tooltip-width"
                        v-html="getPropertyTooltip('iirds:SerialNumber')"
                      />
                    </v-tooltip>
                  </v-col>
                </v-row>
              </v-form-group>
            </div>
          </v-expand-transition>
        </v-card-text>
      </v-card>
    </v-container>
  </v-container>
</template>

<script>
import {mapActions, mapGetters} from "vuex";
import HelpView from "@/shared/block/HelpView";
import util from "@/util";
import VFormGroup from "@/toolkit/step/VFormGroup.vue";
import validations from "@/util/validations.js";

export default {
    name: "OtkStepAddObjects",
    components: {
        VFormGroup,
        HelpView,
    },
    data() {
        return {
            loading: false,
            search: null,
            filter: null,
            selected: [],
            processing: [],
            showHelp: true,
            showDragOverlay: false,
            showSettingsMenu: false,
        };
    },
    computed: {
        ...mapGetters("settings", [
            "getSetting"
        ]),
        ...mapGetters("properties", [
            "getPropertyTooltip",
            "getPropertyLabelById"
        ]),
        companyName: {
            get() {
                const relations = this.$store.getters["projects/getCurrentProjectRelationById"]("plus:companyName");
                return relations.length > 0 ? relations[0] : "";
            },
            set(value) {
                this.updateCurrentProjectRelations({"plus:companyName": [value]});
            }
        },
        domain: {
            get() {
                const relations = this.$store.getters["projects/getCurrentProjectRelationById"]("plus:domain");
                return relations.length > 0 ? relations[0] : "";
            },
            set(value) {
                this.updateCurrentProjectRelations({"plus:domain": [value]});
            }
        },
        serialNumber: {
            get() {
                const relations = this.$store.getters["projects/getCurrentProjectRelationById"]("plus:SerialNumber");
                return relations.length > 0 ? relations[0] : "";
            },
            set(value) {
                this.updateCurrentProjectRelations({"plus:SerialNumber": [value]});
            }
        },
        productType: {
            get() {
                const relations = this.$store.getters["projects/getCurrentProjectRelationById"]("iirds:ProductType");
                return relations.length > 0 ? relations[0] : "";
            },
            set(value) {
                this.updateCurrentProjectRelations({"iirds:ProductType": [value]});
            }
        },
        objectTypeURI: {
            get() {
                const relations = this.$store.getters["projects/getCurrentProjectRelationById"]("iirds:ObjectTypeURI");
                return relations.length > 0 ? relations[0] : "";
            },
            set(value) {
                this.updateCurrentProjectRelations({"iirds:ObjectTypeURI": [value]});
            }
        },
        objectInstanceUri: {
            get() {
                const relations = this.$store.getters["projects/getCurrentProjectRelationById"]("iirds:ObjectInstanceURI");
                return relations.length > 0 ? relations[0] : "";
            },
            set(value) {
                this.updateCurrentProjectRelations({"iirds:ObjectInstanceURI": [value]});
            }
        },
        iirdsVariant: {
            get() {
                const relations = this.$store.getters["projects/getCurrentProjectRelationById"]("iirds:formatRestriction");
                return relations.length > 0 ? relations[0] : "iirds";
            },
            set(value) {
                this.updateCurrentProjectRelations({"iirds:formatRestriction": [value]});
            }
        },
        isNotEmpty() {
            return validations.fNotEmpty(this.$t("Validations.noEmptyInput"));
        },
        isURL() {
            return validations.fIsURL(this.$t("Validations.noValidAutoID"));
        },
        isBelowMaxLength() {
            return validations.fMaxLengthRelValue(255, this.$t("Validations.maxLenghtExceeded"));
        },
        atLeastOneProductDetailForObjectType() {
            return () => {
                const hasValue = this.objectTypeURI || this.objectInstanceUri || this.serialNumber;
                return !!hasValue || this.$t("Validations.minOneOfFields", this.getLabelsForValidationMessages);
            };
        },
        atLeastOneProductDetailForObjectInstance() {
            return () => {
                const hasValue = this.objectTypeURI || this.objectInstanceUri || this.serialNumber;
                return !!hasValue || this.$t("Validations.minOneOfFields", this.getLabelsForValidationMessages);
            };
        },
        atLeastOneProductDetailForSerial() {
            return () => {
                const hasValue = this.objectTypeURI || this.objectInstanceUri || this.serialNumber;

                return !!hasValue || this.$t("Validations.minOneOfFields", this.getLabelsForValidationMessages);
            };
        },
        getLabelsForValidationMessages() {
            return [
                this.getPropertyLabelById("iirds:ObjectTypeURI") + ", " +
                this.getPropertyLabelById("iirds:ObjectInstanceURI") + ", " +
                this.getPropertyLabelById("plus:SerialNumber")
            ];
        }
    },
    watch: {
        objectTypeURI() {
            this.$nextTick(() => {
                if (this.$refs.objectInstanceUriField) {
                    this.$refs.objectInstanceUriField.validate();
                }
                if (this.$refs.serialNumberField) {
                    this.$refs.serialNumberField.validate();
                }
            });
        },
        objectInstanceUri() {
            this.$nextTick(() => {
                if (this.$refs.objectTypeURIField) {
                    this.$refs.objectTypeURIField.validate();
                }
                if (this.$refs.serialNumberField) {
                    this.$refs.serialNumberField.validate();
                }
            });
        },
        serialNumber() {
            this.$nextTick(() => {
                if (this.$refs.objectTypeURIField) {
                    this.$refs.objectTypeURIField.validate();
                }
                if (this.$refs.objectInstanceUriField) {
                    this.$refs.objectInstanceUriField.validate();
                }
            });
        }
    },
    mounted() {
        if (this.$store.getters["projects/getCurrentProjectRelationById"]("iirds:formatRestriction")?.length === 0) {
            this.updateCurrentProjectRelations({"iirds:formatRestriction": ["iirds"]});
        }
    },
    methods: {
        ...util,
        toggleVariantSettings() {
            if (this.iirdsVariant === "H") {
                this.deleteRoleFromProperty({
                    identifier: "iirds:ProductVariant",
                    role: "plus:AssignableMetadata"
                });
                this.deleteRoleFromProperty({
                    identifier: "iirds:ProductVariant",
                    role: "plus:VisibleMetadata"
                });
                this.deleteRoleFromProperty({
                    identifier: "plus:SerialNumber",
                    role: "plus:AssignableMetadata"
                });
                this.deleteRoleFromProperty({
                    identifier: "plus:SerialNumber",
                    role: "plus:VisibleMetadata"
                });
                this.addRoleToProperty({
                    identifier: "iirdsHov:DocumentCategory",
                    role: "plus:RequiredMetadata"
                });
                this.addRoleToProperty({
                    identifier: "iirdsHov:DocumentCategory",
                    role: "plus:VisibleMetadata"
                });
            } else {
                this.addRoleToProperty({
                    identifier: "iirds:ProductVariant",
                    role: "plus:AssignableMetadata"
                });
                this.addRoleToProperty({
                    identifier: "iirds:ProductVariant",
                    role: "plus:VisibleMetadata"
                });
                this.addRoleToProperty({
                    identifier: "plus:SerialNumber",
                    role: "plus:AssignableMetadata"
                });
                this.addRoleToProperty({
                    identifier: "plus:SerialNumber",
                    role: "plus:VisibleMetadata"
                });
                this.deleteRoleFromProperty({
                    identifier: "iirdsHov:DocumentCategory",
                    role: "plus:RequiredMetadata"
                });
                this.deleteRoleFromProperty({
                    identifier: "iirdsHov:DocumentCategory",
                    role: "plus:VisibleMetadata"
                });
            }
        },

        ...mapActions("properties", [
            "addRoleToProperty",
            "deleteRoleFromProperty",
        ]),
        ...mapActions("projects", [
            "updateCurrentProjectRelations"
        ])
    }
};
</script>

<style scoped>
.test-output {
    background-color: #f5f5f5;
    border: 1px solid #e0e0e0;
    border-radius: 4px;
    padding: 12px;
    max-height: 400px;
    overflow-y: auto;
    font-family: 'Courier New', monospace;
    font-size: 12px;
}

.test-log-line {
    padding: 2px 0;
    line-height: 1.5;
}

.theme--dark .test-output {
    background-color: #1e1e1e;
    border-color: #424242;
}
</style>

