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
        sm="6"
        class="px-2"
      >
        <v-card
          dark
          color="accent"
          class="ml-4 mt-8 px-6 py-3 elevation-2"
          outlined
        >
          <v-row wrap>
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
          class="ml-4 mt-7 pa-6 elevation-2"
          outlined
        >
          <span v-html="$t('Otk.welcomeText')" />
        </v-card>
        <v-card
          color="white"
          light
          class="ml-4 mt-7 pa-6 elevation-2"
          outlined
        >
          <span class="caption d-inline-block mb-4">{{ $t('Otk.inCoopWith') }}</span>
          <a href="https://digitaldatachain.com/"><v-img src="/images/vdi2770.svg" width="400px" /></a>
        </v-card>
      </v-col>
      <v-col
        lg="7" sm="6"
        offset-sm="1"
      >
        <v-expansion-panels
          focusable
          multiple
          :value="[0,1]"
          class="ml-4 mt-2 pa-6"
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
                <v-col>
                  <v-text-field
                    :value="getSetting('base_user_name')"
                    :rules="[isNotEmpty]"
                    class="required"
                    prepend-icon="mdi-account"
                    :label="$t('Otk.orgaContactName')"
                    @input="setLocalSetting({key: 'base_user_name', value: $event})"
                  />
                </v-col>
                <v-col>
                  <v-text-field
                    :value="getSetting('base_user_mail')"
                    :rules="[isEmail, isNotEmpty]"
                    class="required"
                    prepend-icon="mdi-email"
                    :label="$t('Otk.orgaContactMail')"
                    @input="setLocalSetting({key: 'base_user_mail', value: $event})"
                  />
                </v-col>
              </v-row>
              <v-row>
                <v-col>
                  <v-text-field
                    v-model="plusOrga"
                    prepend-icon="mdi-domain"
                    :rules="[isNotEmpty]"
                    class="required"
                    :label="getPropertyLabelById('plus:Organization')"
                  />
                </v-col>
                <v-col>
                  <v-text-field
                    v-model="plusOrgaOfficial"
                    prepend-icon="mdi-domain"
                    :rules="[isNotEmpty]"
                    class="required"
                    :label="getPropertyLabelById('plus:OrganizationOfficial')"
                  />
                </v-col>
              </v-row>
              <v-switch
                :label="$t('Otk.acceptUsageAgreement')"
                :input-value="getSetting('user_eula')"
                :rules="[isNotEmpty]"
                class="required"
                @change="setLocalSetting({key: 'user_eula', value: $event})"
              />
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
                <v-col>
                  <v-text-field
                    v-model="plusProductLabel"
                    prepend-icon="mdi-robot-industrial"
                    class="required"
                    :rules="[isNotEmpty]"
                    :label="getPropertyLabelById('iirds:ProductVariant')"
                  />
                </v-col>
                <v-col>
                  <v-text-field
                    :value="plusOrga"
                    prepend-icon="mdi-factory"
                    class="required"
                    disabled
                    :label="getPropertyLabelById('plus:Organization')"
                  />
                </v-col>
              </v-row>
              <v-form-group>
                <v-row>
                  <v-col>
                    <v-text-field
                      v-model="plusSerialNumber"
                      prepend-icon="mdi-counter"
                      :rules="hasAutoId ? [] : [isNotEmptyOr]"
                      :label="getPropertyLabelById('plus:SerialNumber')"
                    />
                  </v-col>
                  <v-col>
                    <v-text-field
                      v-model="plusIEC61406"
                      prepend-icon="mdi-qrcode-scan"
                      :rules="hasSerialNumber ? [] : [isNotEmptyOr]"
                      :label="getPropertyLabelById('plus:IEC61406')"
                    />
                  </v-col>
                </v-row>
              </v-form-group>
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
            valid: false
        };
    },
    computed: {
        plusIEC61406: {
            get() {
                return this.getCurrentProjectRelationById("plus:IEC61406")?.[0];
            },
            set(value) {
                value = value ? [value] : [];
                return this.updateCurrentProjectRelations({"plus:IEC61406": value});
            }
        },
        plusSerialNumber: {
            get() {
                return this.getCurrentProjectRelationById("plus:SerialNumber")?.[0];
            },
            set(value) {
                value = value ? [value] : [];
                return this.updateCurrentProjectRelations({"plus:SerialNumber": value});
            }
        },
        plusOrga: {
            get() {
                return this.$store.getters["settings/getSetting"]("base_orga_name");
            },
            set($event) {
                this.setLocalSetting({key: "base_orga_name", value: $event});
                this.updateCurrentProjectRelations({"plus:Organization": [$event]});
            },

        },
        plusOrgaOfficial: {
            get() {
                return this.$store.getters["settings/getSetting"]("base_orga_fullname");
            },
            set($event) {
                this.setLocalSetting({key: "base_orga_fullname", value: $event});
                this.updateCurrentProjectRelations({"plus:OrganizationOfficial": [$event]});
            },
        },
        plusProductLabel: {
            get() {
                return this.getCurrentProjectRelationById("iirds:ProductVariant")?.[0];
            },
            set(value) {
                value = value ? [value] : [];
                return this.updateCurrentProjectRelations({"iirds:ProductVariant": value});
            }
        },
        isEmail() {
            return validations.fIsEmail(this.$t("Validations.noValidMailAdress"));
        },
        isNotEmpty() {
            return validations.fNotEmpty(this.$t("Validations.noEmptyInput"));
        },
        hasSerialNumber() {
            return validations.fNotEmpty( this.$t("Validations.noEmptyInput"))(this.plusSerialNumber) === true;
        },
        hasAutoId() {
            return validations.fNotEmpty( this.$t("Validations.noEmptyInput"))(this.plusIEC61406) === true;
        },
        isNotEmptyOr() {
            const labels = [this.getPropertyLabelById("plus:SerialNumber"), this.getPropertyLabelById("plus:IEC61406")].join(", ");
            return validations.fNotEmpty( this.$t("Validations.minOneOfFields", [labels]));
        },
        ...mapGetters("settings", ["getSetting", "isProductNotValidCount", "isOrgaIsNotValidCount"]),
        ...mapGetters("projects", ["getCurrentProjectRelationById"]),
        ...mapGetters("properties", ["getPropertyLabelById"])
    },
    created() {

        if (this.plusOrga) {
            this.updateCurrentProjectRelations({"plus:Organization": [this.plusOrga]});
        }

        if (this.plusOrgaOfficial) {
            this.updateCurrentProjectRelations({"plus:OrganizationOfficial": [this.plusOrgaOfficial]});
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