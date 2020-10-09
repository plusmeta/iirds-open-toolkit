<!--
  Copyright 2020 plusmeta GmbH
  License: MIT
-->

<template>
  <v-dialog
    :value="true"
    max-width="50vw"
    @click:outside="$emit('close')"
  >
    <v-card>
      <v-card-title class="text-h6">
        {{ $t('App.licenses') }}
      </v-card-title>
      <v-card-text class="pa-2">
        <v-data-table
          :headers="getLicenseHeaders"
          :items="getLicenseData"
          must-sort
          :items-per-page="5"
          sort-by="label"
          item-key="id"
        >
          <template #item[name]="{ item }">
            <a
              class="grey--text"
              :href="item.repo"
              target="_blank"
            >
              {{ item.name }}
              <v-icon
                v-if="item.repo"
                small
                right
              >
                mdi-open-in-new
              </v-icon>
            </a>
          </template>
          <template #item[license]="{ item }">
            <a
              class="grey--text"
              :href="item.file"
              target="_blank"
            >
              {{ item.license }}
              <v-icon
                v-if="item.file"
                small
                right
              >
                mdi-open-in-new
              </v-icon>
            </a>
          </template>
        </v-data-table>
      </v-card-text>
      <v-card-actions>
        <v-btn
          text
          @click="$emit('close')"
        >
          {{ $t('Actions.cancel') }}
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
import licenseData from "@/config/legal/vendors.json";

export default {
    name: "LicenseInfoDialog",
    computed: {
        getLicenseData() {
            return Object.entries(licenseData).map((entry) => {
                let [key, value] = entry;
                return {
                    name: key,
                    license: value.licenses,
                    repo: value.repository,
                    file: value.licenseUrl
                };
            });
        },
        getLicenseHeaders() {
            return [
                {
                    text: this.$t("Common.name"),
                    align: "left",
                    sortable: true,
                    value: "name"
                },
                {
                    text: this.$t("App.license"),
                    align: "left",
                    sortable: true,
                    value: "license"
                }
            ];
        },
    }
};
</script>
