<!--
 * VDI 2770 Open Toolkit
 * Copyright 2022 plusmeta GmbH
 * License: MIT
-->

<template>
  <v-footer
    app
    dark
    inset
    min-height="36"
    padless
    :color="getFooterColor"
  >
    <v-fab-transition>
      <v-btn
        v-if="isInActiveWorkflow"
        v-show="!isFirstStep"
        fab
        absolute
        bottom
        left
        :color="arePreviousRulesValid ? 'secondary' : 'accent'"
        large
        :class="{'mb-8': true, 'elevation-0': !$vuetify.theme.dark}"
        @click="previousStep()"
      >
        <v-icon large>
          mdi-arrow-left
        </v-icon>
      </v-btn>
    </v-fab-transition>

    <v-spacer />

    <div v-if="isInActiveWorkflow && isRuleViolation">
      <span class="subtitle-2">{{ $t("Common.ruleViolation") }}</span>
    </div>

    <div v-if="isInActiveWorkflow && isExplainerView && !isRuleViolation">
      <span class="subtitle-2">{{ $t("Common.ruleExplainer") }}</span>
      <span v-if="getCurrentExplanation" class="subtitle-2">:&nbsp;
        <span class="font-weight-bold">{{ getCurrentExplanation }}</span>
      </span>
    </div>

    <span v-if="!isExplainerView && !isRuleViolation" class="caption grey--text">
      © 2022 <a href="https://plusmeta.de" target="_blank">plusmeta GmbH</a>
      &bull;
      <a href="https://digitaldatachain.com/" target="_blank">digitaldatachain.com </a>
    </span>

    <v-spacer />

    <v-fab-transition>
      <v-btn
        v-if="isInActiveWorkflow"
        v-show="isValid && !isLastStep"
        fab
        absolute
        bottom
        right
        :class="{'mb-8': true, 'elevation-0': !$vuetify.theme.dark}"
        large
        color="accent"
        @click="nextStep()"
      >
        <v-icon large>
          mdi-arrow-right
        </v-icon>
      </v-btn>
    </v-fab-transition>

    <v-btn
      v-show="!isValid && !isRuleViolation"
      class="mr-4"
      icon
      color="white"
      :disabled="isInternetExplorer"
      @click="showExplainer = !showExplainer"
    >
      <v-icon>
        {{ isExplainerView ? "mdi-close" : "mdi-information-outline" }}
      </v-icon>
    </v-btn>

    <v-btn
      v-show="isRuleViolation && isInActiveWorkflow"
      class="mr-4"
      icon
      @click="previousStep()"
    >
      <v-icon>
        mdi-alert-outline
      </v-icon>
    </v-btn>

    <v-fab-transition>
      <v-btn
        v-if="isInActiveWorkflow"
        v-show="isValid && isLastStep"
        fab
        absolute
        bottom
        right
        :class="{'mb-8': true, 'elevation-0': !$vuetify.theme.dark}"
        large
        color="accent"
        @click="closeProject()"
      >
        <v-icon large>
          mdi-check
        </v-icon>
      </v-btn>
    </v-fab-transition>
  </v-footer>
</template>

<script>
import { mapGetters, mapActions } from "vuex";
import util from "@/util";

export default {
    name: "OtkBottomNav",
    data() {
        return {
            showExplainer: false
        };
    },
    computed: {
        isWorkflowStarted() {
            return this.getCurrentProgress > 0;
        },
        isInternetExplorer() {
            return util.isIE();
        },
        isInActiveWorkflow() {
            return this.isWorkflowStarted &&
              this.$route.name ===  "OtkWorkflowStep";
        },
        isLastStep() {
            let progress = this.getCurrentProgress;
            let workflow = this.getCurrentWorkflow;
            if (workflow !== undefined && workflow.hasOwnProperty("steps")) {
                return progress === workflow.steps.length;
            } else {
                return true;
            }
        },
        isFirstStep() {
            return this.getCurrentProgress && this.getCurrentProgress < 2;
        },
        isExplainerView() {
            return this.isInActiveWorkflow && this.showExplainer && !this.isValid;
        },
        isValid() {
            let isValid = this.getCurrentRules.every((rule) => {
                return rule(this.$store);
            });
            return isValid && this.arePreviousRulesValid;
        },
        arePreviousRulesValid() {
            let allPreviousValid = true;
            for (let progress = 0; progress < this.getCurrentProgress - 1 ; progress++) {
                const step = this.getCurrentWorkflow?.steps[progress];
                const rules = step?.rules || [];

                const areStepRulesValid = rules.every((rule) => {
                    return rule(this.$store);
                });

                if (!areStepRulesValid) {
                    allPreviousValid = false;
                }
            }
            return allPreviousValid;
        },
        wasProjectInitialized() {
            return this.getCurrentProject.hasOwnProperty("objectUuids");
        },
        isRuleViolation() {
            return !this.arePreviousRulesValid && this.wasProjectInitialized;
        },
        getCurrentWorkflow() {
            return this.getWorkflowById(this.getCurrentWorkflowId);
        },
        getFooterColor() {
            if (this.isInActiveWorkflow && !this.arePreviousRulesValid) return "error";
            if (this.isInActiveWorkflow && this.isExplainerView) return "info";
            return "default";
        },
        ...mapGetters("projects", [
            "getCurrentWorkflowId",
            "getCurrentProgress",
            "getCurrentProject"
        ]),
        ...mapGetters("workflows", [
            "getWorkflowById",
            "getCurrentRules",
            "getCurrentExplanation"
        ])
    },
    methods: {
        getLastValidStep() {
            for (let progress = 0; progress <= this.getCurrentProgress - 1 ; progress++) {
                const step = this.getCurrentWorkflow?.steps[progress];
                const rules = step?.rules || [];

                const arePreviousRulesValid = rules.every((rule) => {
                    return rule(this.$store);
                });

                if (!arePreviousRulesValid) {
                    return progress + 1;
                }
            }
            return this.getCurrentProgress;
        },
        async nextStep() {
            if (!this.isLastStep) {
                this.showExplainer = false;
                await this.nextProjectStepLocal();
            }
        },
        async previousStep() {
            if (!this.isFirstStep) {
                this.showExplainer = false;
                if (this.arePreviousRulesValid) {
                    await this.previousProjectStepLocal();
                } else {
                    await this.setCurrentProgressLocal(this.getLastValidStep());
                }
            }
        },
        closeProject() {
            this.showExplainer = false;
            window.location.reload();
        },
        ...mapActions("projects", [
            "nextProjectStepLocal",
            "previousProjectStepLocal",
            "setCurrentProgressLocal"
        ])
    }
};
</script>
<style>
  .theme--dark.v-btn--active.no-color-change:hover::before,
  .theme--dark.v-btn--active.no-color-change::before  {
    opacity: 0;
  }
</style>
