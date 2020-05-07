/*!
 * Copyright 2020 plusmeta GmbH
 * License: MIT
 */

import Vue from "vue";

const init = () => {
    const modules = require.context("@/config/settings", true, /\.json$/);
    const settings = modules.keys().map(modules);
    return settings.reduce((obj, mod) => {
        Object.assign(obj, mod);
        return obj;
    }, {});
};

// initial state
const state = {
    ready: false,
    current_project: null,
    settings: {}
};

// getters
const getters = {
    isReady: (state) => {
        return state.ready;
    },
    isDarkTheme: (state) => {
        return !!state.settings?.theme?.dark;
    },
    getTheme: (state) => {
        return state.settings?.theme || {};
    },
    getSetting: state => (key) => {
        return state.settings[key] ?? undefined;
    },
    getSettings: (state) => {
        return state.settings;
    },
    getCurrentLocale: (state) => {
        return state.settings.locale || "de";
    },
    getCurrentProjectUuid: (state) => {
        return state.current_project || "";
    },
    getLogo: (state, getters) => {
        const mode = (getters.isDarkTheme) ? "dark" : "light";
        return state.settings.theme?.logo[mode] || "dark";
    },
    getLogoForTheme: (state, getters) => (theme) => {
        return state.settings.theme?.logo[theme] || "dark";
    }
};

// actions
const actions = {
    startApplication({ commit }, ready) {
        commit("SET_APP_READY", ready);
    },
    setLocalSetting({ commit }, {key, value}) {
        commit("SET_SIMPLE_SETTING", {key, value});
    },
    changeTheme({ commit, getters, dispatch }, dark) {
        commit("CHANGE_THEME", dark);
    },
    changeLanguageLocal({ commit, getters, dispatch }, locale) {
        commit("CHANGE_LANGUAGE", locale);
    },
    setCurrentProjectLocal({ commit, getters, dispatch, rootGetters }, projectUuid) {
        commit("SET_CURRENT_PROJECT", projectUuid);
    },
    resetSettings({ commit, getters }, override = false) {
        if (override || !Object.keys(getters.getSettings).length) {
            window.localStorage.removeItem("settings");
            commit("RESET_LOCAL_SETTINGS");
        }
    }
};

// mutations
const mutations = {
    SET_APP_READY(state, ready) {
        Vue.set(state, "ready", ready);
    },
    SET_SIMPLE_SETTING(state, {key, value}) {
        Vue.set(state.settings, key, value);
    },
    RESET_LOCAL_SETTINGS(state) {
        Vue.set(state, "settings", init());
    },
    CHANGE_LANGUAGE(state, payload) {
        Vue.set(state.settings, "locale", payload);
    },
    CHANGE_THEME(state, payload) {
        Vue.set(state.settings.theme, "dark", payload);
    },
    SET_CURRENT_PROJECT (state, projectUuid) {
        Vue.set(state, "current_project", projectUuid);
    }
};


export default {
    namespaced: true,
    state,
    getters,
    actions,
    mutations
};
