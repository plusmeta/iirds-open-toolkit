<!-- eslint-disable vue/no-v-html -->
<!--
  Copyright 2022 plusmeta GmbH
  License: MIT
-->

<template>
  <v-container fluid>
    <v-row wrap>
      <v-col
        lg="3"
        offset-lg="1"
        md="6"
        sm="12"
        class="px-2"
      >
        <v-card
          dark
          color="accent"
          class="px-6 py-3 elevation-2"
          outlined
        >
          <v-row align="center" justify="center">
            <v-col cols="auto">
              <v-img
                src="/images/plusmeta.svg"
                width="64px"
              />
            </v-col>
            <v-col class="mt-3">
              <span class="d-inline-block display-1 ">
                VDI 2770 Open Toolkit
              </span>
            </v-col>
          </v-row>
        </v-card>
        <v-card
          color="secondary lighten-3"
          light
          class="mt-7 pa-6 elevation-2"
          outlined
        >
          <span v-html="$t('Otk.welcomeText')" />
        </v-card>
        <v-card
          color="white"
          light
          class="mt-7 pa-6 elevation-2"
          outlined
        >
          <v-row justify="center" align="center">
            <v-col cols="auto">
              <a href="https://plusmeta.de/" target="_blank"><v-img src="/images/plusmeta_logo.svg" width="300px" /></a>
            </v-col>
            <v-col cols="auto">
              <div class="d-inline-block body-2 ">
                <a href="https://plusmeta.de/" target="_blank">plusmeta GmbH</a><br>
                Kaiserstraße 235<br>
                76133 Karlsruhe<br>
                <a href="mailto:info@plusmeta.de">info@plusmeta.de</a><br>
              </div>
            </v-col>
          </v-row>
          <v-row align="center" justify="center">
            <v-col>
              <span class="caption d-inline-block mb-4">{{ $t('Otk.inCoopWith') }}</span>
            </v-col>
          </v-row>
          <v-row
            class="mt-0" align="center"
            justify="center"
          >
            <v-col cols="auto">
              <a href="https://digitaldatachain.com/" target="_blank"><v-img src="/images/vdi2770.svg" width="300px" /></a>
            </v-col>
          </v-row>
        </v-card>
      </v-col>
      <v-col
        offset-lg="1"
        md="6"
        sm="12"
      >
        <v-expansion-panels
          focusable
          multiple
          :value="[0,1,2]"
        >
          <v-expansion-panel>
            <v-expansion-panel-header
              :outlined="!$vuetify.theme.dark"
              style="min-height: 48px"
              class="py-0"
            >
              <v-row no-gutters>
                <v-col>
                  <span class="subtitle-2">{{ $t('Otk.orgaGroup') }}</span>
                </v-col>
                <v-col cols="auto">
                  <v-badge
                    v-if="isOrgaIsNotValidCount > 0"
                    color="accent"
                    :content="isOrgaIsNotValidCount"
                    inline
                  />
                  <v-badge
                    v-if="isOrgaIsNotValidCount === 0"
                    color="accent"
                    icon="mdi-check"
                    inline
                  />
                </v-col>
              </v-row>
            </v-expansion-panel-header>

            <v-expansion-panel-content class="pt-4">
              <v-row>
                <v-col cols="12" lg="6">
                  <v-row align="center">
                    <v-col>
                      <v-text-field
                        v-model="vdiAuthorName"
                        :rules="[isNotEmpty]"
                        class="required"
                        :prepend-icon="getPropertyIcon('vdi:AuthorName')"
                        :label="getPropertyLabelById('vdi:AuthorName')"
                      />
                    </v-col>
                    <v-col v-if="getPropertyTooltip('vdi:AuthorName')" cols="auto">
                      <v-tooltip top>
                        <template v-slot:activator="{ on: tooltip }">
                          <v-icon
                            class="cursor-pointer"
                            v-on="tooltip"
                          >
                            mdi-information-outline
                          </v-icon>
                        </template>
                        <div v-html="getPropertyTooltip('vdi:AuthorName')" />
                      </v-tooltip>
                    </v-col>
                  </v-row>
                </v-col>
                <v-col cols="12" lg="6">
                  <v-row align="center">
                    <v-col>
                      <v-text-field
                        v-model="vdiAuthorEmail"
                        :rules="[isEmail, isNotEmpty]"
                        class="required"
                        :prepend-icon="getPropertyIcon('vdi:AuthorEmail')"
                        :label="getPropertyLabelById('vdi:AuthorEmail')"
                      />
                    </v-col>
                    <v-col v-if="getPropertyTooltip('vdi:AuthorEmail')" cols="auto">
                      <v-tooltip top>
                        <template v-slot:activator="{ on: tooltip }">
                          <v-icon
                            class="cursor-pointer"
                            v-on="tooltip"
                          >
                            mdi-information-outline
                          </v-icon>
                        </template>
                        <div v-html="getPropertyTooltip('vdi:AuthorEmail')" />
                      </v-tooltip>
                    </v-col>
                  </v-row>
                </v-col>
              </v-row>
              <!--              <v-form-group-->
              <!--                :label="$t('Otk.orgaGroup')"-->
              <!--              >-->
              <v-row>
                <v-col cols="12" lg="6">
                  <v-row align="center">
                    <v-col>
                      <v-text-field
                        v-model="vdiOrga"
                        :prepend-icon="getPropertyIcon('vdi:OrganizationName')"
                        :rules="[isNotEmpty]"
                        class="required"
                        :label="getPropertyLabelById('vdi:OrganizationName')"
                      />
                    </v-col>
                    <v-col v-if="getPropertyTooltip('vdi:OrganizationName')" cols="auto">
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
                        <div v-html="getPropertyTooltip('vdi:OrganizationName')" />
                      </v-tooltip>
                    </v-col>
                  </v-row>
                </v-col>
                <v-col cols="12" lg="6">
                  <v-row align="center">
                    <v-col>
                      <v-text-field
                        v-model="vdiOrgaOfficial"
                        :prepend-icon="getPropertyIcon('vdi:OrganizationOfficialName')"
                        :rules="[isNotEmpty]"
                        class="required"
                        :label="getPropertyLabelById('vdi:OrganizationOfficialName')"
                      />
                    </v-col>
                    <v-col v-if="getPropertyTooltip('vdi:OrganizationOfficialName')" cols="auto">
                      <v-tooltip top>
                        <template v-slot:activator="{ on: tooltip }">
                          <v-icon
                            class="cursor-pointer"
                            v-on="tooltip"
                          >
                            mdi-information-outline
                          </v-icon>
                        </template>
                        <div v-html="getPropertyTooltip('vdi:OrganizationOfficialName')" />
                      </v-tooltip>
                    </v-col>
                  </v-row>
                </v-col>
                <v-col
                  lg="6" cols="12"
                  class="mt-0 pt-0"
                >
                  <v-row align="center">
                    <v-col>
                      <v-text-field
                        v-model="vdiOrgaId"
                        :prepend-icon="getPropertyIcon('vdi:OrganizationId')"
                        :rules="[isNotEmpty]"
                        class="required"
                        :label="getPropertyLabelById('vdi:OrganizationId')"
                      />
                    </v-col>
                    <v-col v-if="getPropertyTooltip('vdi:OrganizationId')" cols="auto">
                      <v-tooltip top>
                        <template v-slot:activator="{ on: tooltip }">
                          <v-icon
                            class="cursor-pointer"
                            v-on="tooltip"
                          >
                            mdi-information-outline
                          </v-icon>
                        </template>
                        <div v-html="getPropertyTooltip('vdi:OrganizationId')" />
                      </v-tooltip>
                    </v-col>
                  </v-row>
                </v-col>
              </v-row>
              <!--              </v-form-group>-->
              <v-row>
                <v-col>
                  <v-switch
                    :label="$t('Otk.acceptUsageAgreement')"
                    :input-value="getSetting('user_eula')"
                    :rules="[isNotEmpty]"
                    class="required"
                    @change="setLocalSetting({key: 'user_eula', value: $event})"
                  />
                </v-col>
              </v-row>
            </v-expansion-panel-content>
          </v-expansion-panel>

          <v-expansion-panel>
            <v-expansion-panel-header
              :outlined="!$vuetify.theme.dark"
              style="min-height: 48px"
              class="py-0"
            >
              <v-row no-gutters>
                <v-col>
                  <span class="subtitle-2 pr-2">{{ $t('Otk.equipmentGroup') }}</span>
                </v-col>
                <v-col cols="auto">
                  <v-badge
                    v-if="isProductNotValidCount > 0"
                    color="accent"
                    :content="isProductNotValidCount"
                    inline
                  />
                  <v-badge
                    v-if="isProductNotValidCount === 0"
                    color="accent"
                    icon="mdi-check"
                    inline
                  />
                </v-col>
              </v-row>
            </v-expansion-panel-header>

            <v-expansion-panel-content class="pt-4">
              <v-row>
                <v-col cols="12" lg="6">
                  <v-row align="center">
                    <v-col>
                      <v-text-field
                        v-model="vdiProductVariant"
                        :prepend-icon="getPropertyIcon('vdi:ProductVariant')"
                        class="required"
                        :rules="[isNotEmpty]"
                        :label="getPropertyLabelById('vdi:ProductVariant')"
                      />
                    </v-col>
                    <v-col v-if="getPropertyTooltip('vdi:ProductVariant')" cols="auto">
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
                        <div v-html="getPropertyTooltip('vdi:ProductVariant')" />
                      </v-tooltip>
                    </v-col>
                  </v-row>
                </v-col>

                <v-col cols="12" lg="6">
                  <v-row align="center">
                    <v-col>
                      <v-text-field
                        v-model="vdiEquipmentId"
                        :prepend-icon="getPropertyIcon('vdi:EquipmentId')"
                        class="required"
                        :rules="[isNotEmpty]"
                        :label="getPropertyLabelById('vdi:EquipmentId')"
                      />
                    </v-col>
                    <v-col v-if="getPropertyTooltip('vdi:EquipmentId')" cols="auto">
                      <v-tooltip top>
                        <template v-slot:activator="{ on: tooltip }">
                          <v-icon
                            class="cursor-pointer"
                            v-on="tooltip"
                          >
                            mdi-information-outline
                          </v-icon>
                        </template>
                        <div v-html="getPropertyTooltip('vdi:EquipmentId')" />
                      </v-tooltip>
                    </v-col>
                  </v-row>
                </v-col>
              </v-row>
              <v-form-group
                required
                :label="$t('Otk.productReference')"
              >
                <v-row>
                  <v-col cols="12" lg="6">
                    <v-text-field
                      v-model="vdiSerialNumber"
                      :prepend-icon="getPropertyIcon('vdi:SerialNumber')"
                      :rules="hasAutoId ? [] : [isNotEmptyOr]"
                      :label="getPropertyLabelById('vdi:SerialNumber')"
                    />
                  </v-col>
                  <v-col cols="12" lg="6">
                    <v-text-field
                      v-model="vdiIEC61406"
                      :prepend-icon="getPropertyIcon('vdi:IEC61406')"
                      :rules="hasSerialNumber ? [] : [isNotEmptyOr]"
                      :label="getPropertyLabelById('vdi:IEC61406')"
                    />
                  </v-col>
                </v-row>
              </v-form-group>
            </v-expansion-panel-content>
          </v-expansion-panel>

          <v-expansion-panel>
            <v-expansion-panel-header
              :outlined="!$vuetify.theme.dark"
              style="min-height: 48px"
              class="py-0"
            >
              <v-row no-gutters>
                <v-col>
                  <span class="subtitle-2 pr-2">{{ $t('Otk.projectGroup') }}</span>
                </v-col>
                <v-col cols="auto">
                  <v-badge
                    color="accent"
                    icon="mdi-check"
                    inline
                  />
                </v-col>
              </v-row>
            </v-expansion-panel-header>

            <v-expansion-panel-content class="pt-4">
              <v-row>
                <v-col cols="12" lg="6">
                  <v-row align="center">
                    <v-col>
                      <v-text-field
                        v-model="vdiInternalProjectId"
                        :prepend-icon="getPropertyIcon('vdi:InternalProjectId')"
                        :label="getPropertyLabelById('vdi:InternalProjectId')"
                      />
                    </v-col>
                    <v-col v-if="getPropertyTooltip('vdi:InternalProjectId')" cols="auto">
                      <v-tooltip top>
                        <template v-slot:activator="{ on: tooltip }">
                          <v-icon
                            class="cursor-pointer"
                            v-on="tooltip"
                          >
                            mdi-information-outline
                          </v-icon>
                        </template>
                        <div v-html="getPropertyTooltip('vdi:InternalProjectId')" />
                      </v-tooltip>
                    </v-col>
                  </v-row>
                </v-col>
                <v-col cols="12" lg="6">
                  <v-row align="center">
                    <v-col>
                      <v-text-field
                        v-model="vdiCustomerProjectId"
                        :prepend-icon="getPropertyIcon('vdi:CustomerProjectId')"
                        :label="getPropertyLabelById('vdi:CustomerProjectId')"
                      />
                    </v-col>
                    <v-col v-if="getPropertyTooltip('vdi:CustomerProjectId')" cols="auto">
                      <v-tooltip top>
                        <template v-slot:activator="{ on: tooltip }">
                          <v-icon
                            class="cursor-pointer"
                            v-on="tooltip"
                          >
                            mdi-information-outline
                          </v-icon>
                        </template>
                        <div v-html="getPropertyTooltip('vdi:CustomerProjectId')" />
                      </v-tooltip>
                    </v-col>
                  </v-row>
                </v-col>
                <v-col cols="12" lg="6">
                  <v-row align="center">
                    <v-col>
                      <v-text-field
                        v-model="vdiReferenceLabel"
                        :prepend-icon="getPropertyIcon('vdi:ReferenceLabel')"
                        :label="getPropertyLabelById('vdi:ReferenceLabel')"
                      />
                    </v-col>
                    <v-col v-if="getPropertyTooltip('vdi:ReferenceLabel')" cols="auto">
                      <v-tooltip top>
                        <template v-slot:activator="{ on: tooltip }">
                          <v-icon
                            class="cursor-pointer"
                            v-on="tooltip"
                          >
                            mdi-information-outline
                          </v-icon>
                        </template>
                        <div v-html="getPropertyTooltip('vdi:ReferenceLabel')" />
                      </v-tooltip>
                    </v-col>
                  </v-row>
                </v-col>
              </v-row>
            </v-expansion-panel-content>
          </v-expansion-panel>
        </v-expansion-panels>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import { mapActions, mapGetters } from "vuex";
import util from "@/util";
import validations from "@/util/validations";
import VFormGroup from "@/toolkit/step/VFormGroup";

export default {
    name: "StepWelcome",
    components: { VFormGroup },
    data() {
        return {
            valid: false,
        };
    },
    computed: {
        vdiAuthorName: {
            get() {
                return this.$store.getters["settings/getSetting"]("base_user_name");
            },
            set(value) {
                this.setLocalSetting({key: "base_user_name", value});
                value = value ? [value] : [];
                return this.updateCurrentProjectRelations({"vdi:AuthorName": value});
            }
        },
        vdiAuthorEmail: {
            get() {
                return this.$store.getters["settings/getSetting"]("base_user_mail");
            },
            set(value) {
                this.setLocalSetting({key: "base_user_mail", value});
                value = value ? [value] : [];
                return this.updateCurrentProjectRelations({"vdi:AuthorEmail": value});
            }
        },
        vdiOrga: {
            get() {
                return this.$store.getters["settings/getSetting"]("base_orga_name");
            },
            set(value) {
                this.setLocalSetting({key: "base_orga_name", value});
                this.updateCurrentProjectRelations({"vdi:OrganizationName": [value]});
            },

        },
        vdiOrgaOfficial: {
            get() {
                return this.$store.getters["settings/getSetting"]("base_orga_fullname");
            },
            set(value) {
                this.setLocalSetting({key: "base_orga_fullname", value});
                this.updateCurrentProjectRelations({"vdi:OrganizationOfficialName": [value]});
            },
        },
        vdiOrgaId: {
            get() {
                return this.$store.getters["settings/getSetting"]("base_orga_id");
            },
            set(value) {
                this.setLocalSetting({key: "base_orga_id", value});
                this.updateCurrentProjectRelations({"vdi:OrganizationId": [value]});
            },
        },
        vdiProductVariant: {
            get() {
                return this.getCurrentProjectRelationById("vdi:ProductVariant")?.[0];
            },
            set(value) {
                value = value ? [value] : [];
                return this.updateCurrentProjectRelations({"vdi:ProductVariant": value});
            }
        },
        vdiEquipmentId: {
            get() {
                return this.getCurrentProjectRelationById("vdi:EquipmentId")?.[0];
            },
            set(value) {
                value = value ? [value] : [];
                return this.updateCurrentProjectRelations({"vdi:EquipmentId": value});
            }
        },
        vdiIEC61406: {
            get() {
                return this.getCurrentProjectRelationById("vdi:IEC61406")?.[0];
            },
            set(value) {
                value = value ? [value] : [];
                return this.updateCurrentProjectRelations({"vdi:IEC61406": value});
            }
        },
        vdiSerialNumber: {
            get() {
                return this.getCurrentProjectRelationById("vdi:SerialNumber")?.[0];
            },
            set(value) {
                value = value ? [value] : [];
                return this.updateCurrentProjectRelations({"vdi:SerialNumber": value});
            }
        },
        vdiInternalProjectId: {
            get() {
                return this.getCurrentProjectRelationById("vdi:InternalProjectId")?.[0];
            },
            set(value) {
                value = value ? [value] : [];
                return this.updateCurrentProjectRelations({"vdi:InternalProjectId": value});
            }
        },
        vdiCustomerProjectId: {
            get() {
                return this.getCurrentProjectRelationById("vdi:CustomerProjectId")?.[0];
            },
            set(value) {
                value = value ? [value] : [];
                return this.updateCurrentProjectRelations({"vdi:CustomerProjectId": value});
            }
        },
        vdiReferenceLabel: {
            get() {
                return this.getCurrentProjectRelationById("vdi:ReferenceLabel")?.[0];
            },
            set(value) {
                value = value ? [value] : [];
                return this.updateCurrentProjectRelations({"vdi:ReferenceLabel": value});
            }
        },
        isEmail() {
            return validations.fIsEmail(this.$t("Validations.noValidMailAdress"));
        },
        isNotEmpty() {
            return validations.fNotEmpty(this.$t("Validations.noEmptyInput"));
        },
        hasSerialNumber() {
            return validations.fNotEmpty( this.$t("Validations.noEmptyInput"))(this.vdiSerialNumber) === true;
        },
        hasAutoId() {
            return validations.fNotEmpty( this.$t("Validations.noEmptyInput"))(this.vdiIEC61406) === true;
        },
        isNotEmptyOr() {
            const labels = [this.getPropertyLabelById("vdi:SerialNumber"), this.getPropertyLabelById("vdi:IEC61406")].join(", ");
            return validations.fNotEmpty( this.$t("Validations.minOneOfFields", [labels]));
        },
        ...mapGetters("settings", ["getSetting", "isProductNotValidCount", "isOrgaIsNotValidCount"]),
        ...mapGetters("projects", ["getCurrentProjectRelationById"]),
        ...mapGetters("properties", ["getPropertyLabelById", "getPropertyTooltip", "getPropertyIcon"])
    },
    created() {
        if (this.vdiOrga) {
            this.updateCurrentProjectRelations({"vdi:OrganizationName": [this.vdiOrga]});
        }

        if (this.vdiOrgaOfficial) {
            this.updateCurrentProjectRelations({"vdi:OrganizationOfficialName": [this.vdiOrgaOfficial]});
        }

        if (this.vdiOrgaId) {
            this.updateCurrentProjectRelations({"vdi:OrganizationId": [this.vdiOrgaId]});
        }
    },
    methods: {
        ...util, // for isIE()
        ...mapActions("settings", ["setLocalSetting"]),
        ...mapActions("projects", ["updateCurrentProjectRelations"])
    }
};
</script>

<style>
  div.skeleton-container {
    height: 100%;
    min-height: 100%;
  }

  .welcome {
    width: 100% !important;
    margin-top: 10px;
  }
</style>
