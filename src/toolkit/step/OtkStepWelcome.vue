<!-- eslint-disable vue/no-v-html -->
<!--
  Copyright 2022 plusmeta GmbH
  License: MIT
-->

<template>
  <v-container fluid>
    <v-row wrap>
      <v-col
        lg="4"
        md="6"
        sm="12"
        class="px-2 mx-6"
      >
        <v-card
          dark
          color="accent"
          class="px-6 py-2 elevation-2"
          outlined
        >
          <v-row align="center" justify="center">
            <v-col cols="auto">
              <v-img
                src="/images/plusmeta.svg"
                width="64px"
              />
            </v-col>
            <v-col class="mt-1">
              <span class="d-inline-block display-1 ">
                VDI 2770 Open Toolkit
              </span>
            </v-col>
          </v-row>
        </v-card>
        <v-card
          color="secondary lighten-3"
          light
          class="mt-5 pa-6 elevation-2"
          outlined
        >
          <span v-html="$t('Otk.welcomeText')" />
        </v-card>
        <v-card
          color="white"
          light
          class="mt-5 pa-5 elevation-2"
          outlined
        >
          <v-row align="center" justify="center">
            <v-col cols="auto">
              <span class="subtitle-2">{{ $t('Otk.providedBy') }}</span>
            </v-col>
          </v-row>
          <v-row justify="center" align="center">
            <v-col cols="auto">
              <a href="https://plusmeta.de/" target="_blank"><v-img src="/images/plusmeta_logo.svg" width="300px" /></a>
            </v-col>
          </v-row>
          <v-row justify="center" align="center">
            <v-col cols="auto" class="caption">
              <a href="https://plusmeta.de/" target="_blank">www.plusmeta.de</a>
              &bull;
              <a href="mailto:hallo@plusmeta.de">hallo@plusmeta.de</a>
              &bull;
              <a href="tel:+4972195977777">+49 721 95977777</a>
            </v-col>
          </v-row>
          <v-row align="center" justify="center">
            <v-col cols="auto" class="mt-4">
              <span class="subtitle-2">{{ $t('Otk.inCoopWith') }}</span>
            </v-col>
          </v-row>
          <v-row
            class="mt-0" align="center"
            justify="center"
          >
            <v-col cols="auto">
              <a href="https://digitaldatachain.com/" target="_blank">
                <v-img
                  src="/images/vdi2770.svg" width="300px"
                  height="43px"
                /></a>
            </v-col>
          </v-row>
        </v-card>
      </v-col>
      <v-col
        md="7"
        sm="12"
        class="mx-6"
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
                        v-model="AuthorName"
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
                        <div class="tooltip-width" v-html="getPropertyTooltip('vdi:AuthorName')" />
                      </v-tooltip>
                    </v-col>
                  </v-row>
                </v-col>
                <v-col cols="12" lg="6">
                  <v-row align="center">
                    <v-col>
                      <v-text-field
                        v-model="AuthorEmail"
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
                        <div class="tooltip-width" v-html="getPropertyTooltip('vdi:AuthorEmail')" />
                      </v-tooltip>
                    </v-col>
                  </v-row>
                </v-col>
              </v-row>
              <v-row>
                <v-col cols="12" lg="6">
                  <v-row align="center">
                    <v-col>
                      <v-text-field
                        v-model="OrgaName"
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
                        <div class="tooltip-width" v-html="getPropertyTooltip('vdi:OrganizationName')" />
                      </v-tooltip>
                    </v-col>
                  </v-row>
                </v-col>
                <v-col cols="12" lg="6">
                  <v-row align="center">
                    <v-col>
                      <v-text-field
                        v-model="OrgaOfficialName"
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
                        <div class="tooltip-width" v-html="getPropertyTooltip('vdi:OrganizationOfficialName')" />
                      </v-tooltip>
                    </v-col>
                  </v-row>
                </v-col>
                <v-col
                  lg="6"
                  cols="12"
                  class="mt-0 pt-0"
                >
                  <v-row align="center">
                    <v-col>
                      <v-text-field
                        v-model="OrgaUrl"
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
                        <div class="tooltip-width" v-html="getPropertyTooltip('vdi:OrganizationId')" />
                      </v-tooltip>
                    </v-col>
                  </v-row>
                </v-col>
              </v-row>
              <v-row>
                <v-col
                  lg="6"
                  cols="12"
                >
                  <v-switch
                    :label="$t('Otk.acceptUsageAgreement')"
                    :input-value="getSetting('user_eula')"
                    :rules="[isNotEmpty]"
                    class="required"
                    @change="setLocalSetting({key: 'user_eula', value: $event})"
                  />
                </v-col>
                <v-col
                  lg="6"
                  cols="12"
                  class="mt-4 pt-0"
                >
                  <v-row align="center">
                    <v-col>
                      <v-card class="caption pa-2 secondary--text" flat>
                        {{ $t("Otk.dataProtectionInfo") }}
                      </v-card>
                    </v-col>
                  </v-row>
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
                        v-model="iirdsProductVariant"
                        :prepend-icon="getPropertyIcon('iirds:ProductVariant')"
                        class="required"
                        :rules="[isNotEmpty]"
                        :label="getPropertyLabelById('iirds:ProductVariant')"
                      />
                    </v-col>
                    <v-col v-if="getPropertyTooltip('iirds:ProductVariant')" cols="auto">
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
                        <div class="tooltip-width" v-html="getPropertyTooltip('iirds:ProductVariant')" />
                      </v-tooltip>
                    </v-col>
                  </v-row>
                </v-col>

                <v-col cols="12" lg="6">
                  <v-row align="center">
                    <v-col>
                      <v-text-field
                        v-model="OrderCode"
                        :prepend-icon="getPropertyIcon('iirds:OrderCode')"
                        :label="getPropertyLabelById('iirds:OrderCode')"
                      />
                    </v-col>
                    <v-col v-if="getPropertyTooltip('iirds:OrderCode')" cols="auto">
                      <v-tooltip top>
                        <template v-slot:activator="{ on: tooltip }">
                          <v-icon
                            class="cursor-pointer"
                            v-on="tooltip"
                          >
                            mdi-information-outline
                          </v-icon>
                        </template>
                        <div class="tooltip-width" v-html="getPropertyTooltip('iirds:OrderCode')" />
                      </v-tooltip>
                    </v-col>
                  </v-row>
                </v-col>
              </v-row>
              <v-form-group
                required
                :tooltip="'vdi:SerialNumber'"
                :label="$t('Otk.productReference')"
              >
                <v-row>
                  <v-col cols="12" lg="6">
                    <v-text-field
                      v-model="SerialNumber"
                      :prepend-icon="getPropertyIcon('iirds:SerialNumber')"
                      :rules="hasAutoId ? [] : [isNotEmptyOr]"
                      :label="getPropertyLabelById('iirds:SerialNumber')"
                    />
                  </v-col>
                  <v-col cols="12" lg="6">
                    <v-text-field
                      v-model="ObjectInstanceURI"
                      :prepend-icon="getPropertyIcon('iirds:ObjectInstanceURI')"
                      :rules="hasSerialNumber ? [isBelowMaxLength] : [isNotEmptyOr, isBelowMaxLength]"
                      :counter="255"
                      :label="getPropertyLabelById('iirds:ObjectInstanceURI')"
                    >
                      <template v-slot:append-outer>
                        <v-menu
                          v-model="qrPanel"
                          transition="scale-transition"
                          :close-on-content-click="false"
                        >
                          <template v-slot:activator="{ on }">
                            <v-btn
                              icon
                              class="ml-2 my-0 pa-0"
                              :disabled="!hasValidAutoId"
                              :loading="qrLoading"
                              v-on="on"
                            >
                              <v-icon>
                                mdi-qrcode
                              </v-icon>
                            </v-btn>
                          </template>
                          <v-card
                            color="white"
                            outlined
                            class="pa-2"
                          >
                            <canvas
                              v-show="qrReady"
                              ref="qr"
                            />
                            <v-skeleton-loader
                              v-show="!qrReady"
                              class="mx-auto"
                              boilerplate
                              type="image"
                              :height="getQrWidth"
                              :width="getQrWidth"
                            />
                          </v-card>
                        </v-menu>
                      </template>
                    </v-text-field>
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
                        v-model="InternalProjectId"
                        :prepend-icon="getPropertyIcon('plus:InternalProjectId')"
                        :label="getPropertyLabelById('plus:InternalProjectId')"
                      />
                    </v-col>
                    <v-col v-if="getPropertyTooltip('plus:InternalProjectId')" cols="auto">
                      <v-tooltip top>
                        <template v-slot:activator="{ on: tooltip }">
                          <v-icon
                            class="cursor-pointer"
                            v-on="tooltip"
                          >
                            mdi-information-outline
                          </v-icon>
                        </template>
                        <div class="tooltip-width" v-html="getPropertyTooltip('plus:InternalProjectId')" />
                      </v-tooltip>
                    </v-col>
                  </v-row>
                </v-col>
                <v-col cols="12" lg="6">
                  <v-row align="center">
                    <v-col>
                      <v-text-field
                        v-model="CustomerProjectId"
                        :prepend-icon="getPropertyIcon('plus:CustomerProjectId')"
                        :label="getPropertyLabelById('plus:CustomerProjectId')"
                      />
                    </v-col>
                    <v-col v-if="getPropertyTooltip('plus:CustomerProjectId')" cols="auto">
                      <v-tooltip top>
                        <template v-slot:activator="{ on: tooltip }">
                          <v-icon
                            class="cursor-pointer"
                            v-on="tooltip"
                          >
                            mdi-information-outline
                          </v-icon>
                        </template>
                        <div class="tooltip-width" v-html="getPropertyTooltip('plus:CustomerProjectId')" />
                      </v-tooltip>
                    </v-col>
                  </v-row>
                </v-col>
                <v-col cols="12" lg="6">
                  <v-row align="center">
                    <v-col>
                      <v-text-field
                        v-model="ReferenceDesignation"
                        :prepend-icon="getPropertyIcon('plus:ReferenceDesignation')"
                        :label="getPropertyLabelById('plus:ReferenceDesignation')"
                      />
                    </v-col>
                    <v-col v-if="getPropertyTooltip('plus:ReferenceDesignation')" cols="auto">
                      <v-tooltip top>
                        <template v-slot:activator="{ on: tooltip }">
                          <v-icon
                            class="cursor-pointer"
                            v-on="tooltip"
                          >
                            mdi-information-outline
                          </v-icon>
                        </template>
                        <div class="tooltip-width" v-html="getPropertyTooltip('plus:ReferenceDesignation')" />
                      </v-tooltip>
                    </v-col>
                  </v-row>
                </v-col>
                <v-col cols="12" lg="6">
                  <v-row align="center">
                    <v-col class="pt-8" cols="auto">
                      <v-icon left>
                        mdi-tag-outline
                      </v-icon>
                      <v-btn
                        small
                        class="elevation-0"
                        color="warning"
                        @click="showUpsellDialog"
                      >
                        <v-icon left>
                          mdi-plus
                        </v-icon>
                        {{ $t("Actions.addMetadata") }}
                      </v-btn>
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
import VFormGroup from "@/toolkit/step/VFormGroup";
import * as Sentry from "@sentry/browser";
import QRCode from "qrcode";

import util from "@/util";
import validations from "@/util/validations";

export default {
    name: "StepWelcome",
    components: { VFormGroup },
    data() {
        return {
            valid: false,
            defaultCharCount: 189,
            dpiRatioPxMm: 0.03937011, // reverse-engineered from online calculator
            dpiPrint: 300,
            dpiScreen: 72,
            dpiPreviewScale: 2,
            qrErrorCorrectionLevel: "Q",
            qrModuleSizeMm: 0.35,
            qrPanel: false,
            qrLoading: false,
            qrMode: "byte",
            qrReady: false,
            qrSizes: { // at error correction level "Q"
                SMALL: {
                    chars: [0, 86],
                    size: 45,
                    version: 7
                },
                MEDIUM: {
                    chars: [87, 177],
                    size: 61,
                    version: 11
                },
                LARGE: {
                    chars: [178, 255],
                    size: 73,
                    version: 14
                }
            },
            qrVersion: 9
        };
    },
    computed: {
        AuthorName: {
            get() {
                return this.$store.getters["settings/getSetting"]("base_user_name");
            },
            set(value) {
                this.setLocalSetting({key: "base_user_name", value});
                value = value ? [value] : [];
                Sentry.setTag("user", value[0]);
                return this.updateCurrentProjectRelations({"vdi:AuthorName": value});
            }
        },
        AuthorEmail: {
            get() {
                return this.$store.getters["settings/getSetting"]("base_user_mail");
            },
            set(value) {
                this.setLocalSetting({key: "base_user_mail", value});
                value = value ? [value] : [];
                Sentry.setTag("user.mail", value[0]);
                return this.updateCurrentProjectRelations({"vdi:AuthorEmail": value});
            }
        },
        OrgaName: {
            get() {
                return this.$store.getters["settings/getSetting"]("base_orga_name");
            },
            set(value) {
                this.setLocalSetting({key: "base_orga_name", value});
                Sentry.setTag("user.org", value);
                this.updateCurrentProjectRelations({"vdi:OrganizationName": [value]});
            },

        },
        OrgaOfficialName: {
            get() {
                return this.$store.getters["settings/getSetting"]("base_orga_fullname");
            },
            set(value) {
                this.setLocalSetting({key: "base_orga_fullname", value});
                Sentry.setTag("user.org.full", value);
                this.updateCurrentProjectRelations({"vdi:OrganizationOfficialName": [value]});
            },
        },
        OrgaUrl: {
            get() {
                return this.$store.getters["settings/getSetting"]("base_orga_id");
            },
            set(value) {
                this.setLocalSetting({key: "base_orga_id", value});
                Sentry.setUser("user.org.id", value);
                this.updateCurrentProjectRelations({"vdi:OrganizationId": [value]});
            },
        },
        iirdsProductVariant: {
            get() {
                return this.getCurrentProjectRelationById("iirds:ProductVariant")?.[0];
            },
            set(value) {
                value = value ? [value] : [];
                return this.updateCurrentProjectRelations({"iirds:ProductVariant": value});
            }
        },
        OrderCode: {
            get() {
                return this.getCurrentProjectRelationById("iirds:OrderCode")?.[0];
            },
            set(value) {
                value = value ? [value] : [];
                return this.updateCurrentProjectRelations({"iirds:OrderCode": value});
            }
        },
        ObjectInstanceURI: {
            get() {
                return this.getCurrentProjectRelationById("iirds:ObjectInstanceURI")?.[0];
            },
            set(value) {
                value = value ? [value] : [];
                return this.updateCurrentProjectRelations({"iirds:ObjectInstanceURI": value});
            }
        },
        SerialNumber: {
            get() {
                return this.getCurrentProjectRelationById("iirds:SerialNumber")?.[0];
            },
            set(value) {
                value = value ? [value] : [];
                return this.updateCurrentProjectRelations({"iirds:SerialNumber": value});
            }
        },
        InternalProjectId: {
            get() {
                return this.getCurrentProjectRelationById("plus:InternalProjectId")?.[0];
            },
            set(value) {
                value = value ? [value] : [];
                return this.updateCurrentProjectRelations({"plus:InternalProjectId": value});
            }
        },
        CustomerProjectId: {
            get() {
                return this.getCurrentProjectRelationById("plus:CustomerProjectId")?.[0];
            },
            set(value) {
                value = value ? [value] : [];
                return this.updateCurrentProjectRelations({"plus:CustomerProjectId": value});
            }
        },
        ReferenceDesignation: {
            get() {
                return this.getCurrentProjectRelationById("plus:ReferenceDesignation")?.[0];
            },
            set(value) {
                value = value ? [value] : [];
                return this.updateCurrentProjectRelations({"plus:ReferenceDesignation": value});
            }
        },
        isEmail() {
            return validations.fIsEmail(this.$t("Validations.noValidMailAdress"));
        },
        isNotEmpty() {
            return validations.fNotEmpty(this.$t("Validations.noEmptyInput"));
        },
        hasSerialNumber() {
            return validations.fNotEmpty( this.$t("Validations.noEmptyInput"))(this.SerialNumber) === true;
        },
        hasAutoId() {
            return validations.fNotEmpty( this.$t("Validations.noEmptyInput"))(this.ObjectInstanceURI) === true;
        },
        isNotEmptyOr() {
            const labels = [this.getPropertyLabelById("iirds:SerialNumber"), this.getPropertyLabelById("iirds:ObjectInstanceURI")].join(", ");
            return validations.fNotEmpty( this.$t("Validations.minOneOfFields", [labels]));
        },
        isURL() {
            return validations.fIsURL(this.$t("Validations.noValidAutoID"));
        },
        isBelowMaxLength() {
            return validations.fMaxLengthRelValue(255, this.$t("Validations.maxLenghtExceeded"));
        },
        hasValidAutoId() {
            return !!this.ObjectInstanceURI;
        },
        getInputValue() {
            return this.hasValidAutoId ? this.ObjectInstanceURI : undefined;
        },
        getInputValueLength() {
            return this.getInputValue?.length || this.defaultCharCount;
        },
        getQrMeasures() {
            const charCount = this.getInputValueLength;
            return Object.values(this.qrSizes).find(s => s.chars[0] <= charCount && charCount <= s.chars[1]) || this.qrSizes["LARGE"];
        },
        getQrWidth() {
            return this.calcQrWidth(this.getQrMeasures?.size, this.dpiScreen) * this.dpiPreviewScale; // in pixels
        },
        ...mapGetters("settings", ["getSetting", "isProductNotValidCount", "isOrgaIsNotValidCount"]),
        ...mapGetters("projects", ["getCurrentProjectRelationById"]),
        ...mapGetters("properties", ["getPropertyLabelById", "getPropertyTooltip", "getPropertyIcon"])
    },
    watch: {
        qrPanel: {
            handler(val) {
                if (!val) return;
                this.qrLoading = true;
                window.setTimeout(() => {
                    if (this.$refs.qr) this.showQRCode();
                }, 1000);

            }
        }
    },
    created() {
        if (this.OrgaName) {
            this.updateCurrentProjectRelations({"vdi:OrganizationName": [this.OrgaName]});
        }

        if (this.OrgaOfficialName) {
            this.updateCurrentProjectRelations({"vdi:OrganizationOfficialName": [this.OrgaOfficialName]});
        }

        if (this.OrgaUrl) {
            this.updateCurrentProjectRelations({"vdi:OrganizationId": [this.OrgaUrl]});
        }
    },
    methods: {
        ...util, // for isIE()
        showUpsellDialog() {
            this.$upsell.open(this.$t("Otk.customMetadata"));
        },
        calcQrWidth(codeSize, dpi) {
            return codeSize * dpi * this.dpiRatioPxMm;
        },
        async showQRCode() {
            const codeSize = this.getQrMeasures?.size;
            const qrVersion = this.getQrMeasures?.version;
            const borderSize = 1;
            const qzoneSize = 5 + borderSize;
            const cornerSize = 6 + 2 * borderSize;
            const fullSize = codeSize + 2 * (qzoneSize + borderSize);

            const moduleWidth = this.getQrWidth / fullSize;
            const borderWidth = borderSize * moduleWidth;
            const cornerWidth = cornerSize * moduleWidth;

            let canvas = this.$refs.qr;
            await QRCode.toCanvas(canvas, this.getInputValue, {
                errorCorrectionLevel: this.qrErrorCorrectionLevel,
                margin: qzoneSize,
                width: this.getQrWidth,
                version: qrVersion,
                mode: this.qrMode
            });
            let ctx = canvas.getContext("2d");
            ctx.beginPath();
            ctx.moveTo(canvas.width, canvas.height);
            ctx.lineTo(canvas.width - cornerWidth, canvas.height);
            ctx.lineTo(canvas.width, canvas.height - cornerWidth);
            ctx.fill();
            ctx.lineWidth = borderWidth * 2;
            ctx.strokeRect(0, 0, canvas.width, canvas.height);

            this.qrLoading = false;
            this.qrReady = true;

        },
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
