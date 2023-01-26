<!-- eslint-disable vue/no-v-html -->
<template>
  <v-dialog
    v-if="showDialog"
    :value="true"
    max-width="600px"
    persistent
  >
    <v-card
      class="pa-0"
      color="accent"
    >
      <v-card-title class="title white--text">
        {{ reason }}? - {{ $t("Otk.upselUpgradeNow") }}
      </v-card-title>
      <v-card-text class="pa-0 pm-upsell-bg" />
      <v-card
        light
        class="pa-0"
        tile
      >
        <v-card-text class="pt-4 px-6 pb-2">
          <h3 v-if="reason" class="mb-2">
            {{ reason }} {{ $t("Otk.upsellAndMore") }}
          </h3>
          <h4 v-else>
            {{ $t("Otk.upsellTitle") }}
          </h4>
          <p Otk.upsellText")"v-html="$t(" />
          <p>
            <v-row>
              <v-col cols="6">
                <v-text-field
                  v-model="userName"
                  prepend-icon="mdi-account"
                  dense
                  hide-details
                />
              </v-col>
              <v-col cols="6">
                <v-text-field
                  v-model="userMail"
                  prepend-icon="mdi-email"
                  dense
                  hide-details
                />
              </v-col>
            </v-row>
          </p>
        </v-card-text>
        <v-card-actions class="px-4">
          <v-btn
            text
            :disabled="timer > 0"
            @click="showDialog = false"
          >
            <span>{{ $t("Actions.close") }}</span>
            <span v-if="timer > 0">
              ({{ timer }})
            </span>
          </v-btn>
          <v-spacer />
          <v-btn
            color="accent"
            @click="sendRequest"
          >
            {{ $t('App.sendRequest') }}
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-card>
  </v-dialog>
</template>

<script>
import { mapGetters } from "vuex";
import * as Sentry from "@sentry/browser";
import ObjectHash from "object-hash";

export default {
    name: "UpsellDialog",
    data() {
        return {
            showDialog: false,
            timer: 5,
            reason: null,
            interval: null,
            userName: null,
            userMail: null
        };
    },
    computed: mapGetters("settings", [
        "getSetting",
        "getSettings"
    ]),
    methods: {
        openDialog(reason) {
            this.showDialog = true;
            this.timer = 5;
            this.reason = reason;
            this.userName = this.getSetting("base_user_name");
            this.userMail = this.getSetting("base_user_mail");
            this.startTimer();
        },
        startTimer() {
            window.clearInterval(this.interval);
            this.interval = window.setInterval(() => this.countDownTimer(), 1000);
        },
        countDownTimer() {
            if (this.timer > 0) {
                this.timer = this.timer - 1;
            } else {
                this.timer = null;
                window.clearInterval(this.interval);
            }
        },
        sendRequest() {
            const reason = this.reason || "Upgrade";
            const baseSettings = Object.entries(this.getSettings).filter(entry => entry[0].startsWith("base")).reduce((obj, [key, value]) => {
                obj[key] = value;
                return obj;
            }, {});

            const currentBaseSettingsHash = ObjectHash(JSON.stringify(baseSettings));

            Sentry.setUser({
                id: currentBaseSettingsHash,
                username: this.userName,
                email: this.userMail
            });

            Sentry.setTag("org.name", this.getSetting("base_orga_name"));
            Sentry.setTag("org.full", this.getSetting("base_orga_fullname"));
            Sentry.setTag("org.id", this.getSetting("base_orga_id"));

            Sentry.setTag("reason", reason);
            Sentry.setTag("locale", this.getCurrentLocale);

            Sentry.setExtra("settings", this.getSettings);

            Sentry.captureMessage(`DemoRequest: ${reason}` , "info");

            this.$notify.send(this.$t("App.demoRequestSent"), "success");
            this.showDialog = false;
        }
    }
};
</script>
<style>
    .pm-upsell-bg {
      height: 350px;
      background-image: url(/images/rakete.svg);
      background-size: cover;
      background-position-x: center;
    }
</style>
