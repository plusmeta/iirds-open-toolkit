/*!
 * Copyright 2022 plusmeta GmbH
 * License: MIT
 */

import Vue from "vue";

// state
const state = {};

// getters
const getters = {
    getWorkflowById: state => (workflowId) => {
        return (state.hasOwnProperty(workflowId)) ? state[workflowId] : undefined;
    },
    getWorkflowNameById: (state, getters, rootState, rootGetters) => (workflowId) => {
        let locale = rootGetters["settings/getCurrentLocale"];
        return (state.hasOwnProperty(workflowId)) ? state[workflowId].name[locale] : null;
    },
    getWorkflowStepNameById: (state, getters, rootState, rootGetters) => ({workflowId, stepId}) => {
        let locale = rootGetters["settings/getCurrentLocale"];
        if (state.hasOwnProperty(workflowId) && stepId) {
            return state[workflowId].steps.find((step) => {
                return step.id === stepId;
            }).name[locale];
        } else {
            return null;
        }
    },
    getWorkflowStepById: state => ({workflowId, stepId}) => {
        if (workflowId && stepId && state[workflowId]) {
            return state[workflowId].steps.find((step) => {
                return step.id === stepId;
            });
        } else {
            return undefined;
        }
    },
    getCurrentWorkflow: (state, getters, rootState, rootGetters) => {
        let currentWorkflow = rootGetters["projects/getCurrentWorkflowId"];
        return state[currentWorkflow];
    },
    getCurrentWorkflowStep: (state, getters, rootState, rootGetters) => {
        let progress = rootGetters["projects/getCurrentProgress"] - 1;
        let workflow = getters.getCurrentWorkflow;
        if (workflow && progress >= 0 && workflow.steps[progress]) {
            return workflow.steps[progress];
        } else {
            return {};
        }
    },
    getCurrentRules: (state, getters, rootState, rootGetters) => {
        let currentWorkflowId = rootGetters["projects/getCurrentWorkflowId"];
        let currentProgress = rootGetters["projects/getCurrentProgress"];
        if (!currentProgress) {
            currentProgress = 1;
        }

        if (currentWorkflowId !== null && currentProgress >= 1 && state[currentWorkflowId]) {
            return state[currentWorkflowId].steps[currentProgress - 1]?.rules || [];
        } else {
            return [];
        }
    },
    getCurrentExplanation: (state, getters, rootState, rootGetters) => {
        let currentWorkflowId = rootGetters["projects/getCurrentWorkflowId"];
        let currentProgress = rootGetters["projects/getCurrentProgress"];
        let locale = rootGetters["settings/getCurrentLocale"];

        if (currentWorkflowId !== null && currentProgress !== 0) {
            let currentStep = state[currentWorkflowId].steps[currentProgress - 1];
            if (currentStep.ruleExpl && currentStep.ruleExpl[locale]) {
                return currentStep.ruleExpl[locale];
            } else return undefined;
        } else return undefined;
    },
    getCurrentWorkflowSetting: (state, getters, rootState, rootGetters) => (settingURI) => {
        let currentWorkflow = getters.getCurrentWorkflow;
        let workflowSettings = currentWorkflow.settings || [];
        let settingDefinition = workflowSettings.find(setting => setting.identifier === settingURI);
        let userSetting = rootGetters["projects/getCurrentProjectRelationById"](settingURI);

        if (!!userSetting.length  && !!settingDefinition) {
            return JSON.parse(userSetting[0]);
        } else if (!!userSetting.length  && !settingDefinition) {
            // eslint-disable-next-line no-console
            console.info(`Accessing undeclared workflow setting "${settingURI}" via project relations`);
            return JSON.parse(userSetting[0]);
        } else if (!userSetting.length  && !!settingDefinition) {
            return settingDefinition.standard;
        } else {
            // eslint-disable-next-line no-console
            console.warn(`Accessing unknown workflow setting "${settingURI}"`);
            return undefined;
        }
    }
};

// actions
const actions = {
    async initWorkflowsLocal ({ commit, dispatch, rootGetters }) {
        // get workflows
        const workflows = require.context("@/workflows", true, /index\.js$/);
        const modules = workflows.keys().map(workflows);
        commit("RESET_WORKFLOWS");
        // assigned authorized workflows
        for (let workflow of modules) {
            let workflowRole = `workflow:${workflow.default.id}`;
            if (Vue.security.check(workflowRole)) {
                commit("REGISTER_WORKFLOW", {
                    workflowId: workflow.default.id,
                    workflowModule: workflow.default
                });
                if (workflow.default.hasOwnProperty("properties")) {
                    let workflowProps = await workflow.default.properties();
                    workflowProps = workflowProps.default
                        .filter(prop => !rootGetters["properties/isProperty"](prop.identifier));
                    if (workflowProps.length > 0) {
                        await dispatch("properties/savePropertiesLocal",
                            workflowProps, { root: true });
                    }
                }
            }
        }
    }
};

// mutations
const mutations = {
    RESET_WORKFLOWS (state) {
        Object.keys(state).forEach(key => delete state[key]);
    },
    REGISTER_WORKFLOW (state, {workflowId, workflowModule}) {
        Vue.set(state, workflowId, workflowModule); // Vue.set um Reaktivität sicherzustellen
    }
};

export default {
    namespaced: true,
    state,
    getters,
    actions,
    mutations
};
