/*!
 * Copyright 2022 plusmeta GmbH
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
    settings: {
        base_orga_name: null,
        base_orga_fullname: null,
        base_orga_url: null,
        base_user_mail: null,
        base_user_name: null,
        locale: "de",
        ui_shortcuts: true,
        ui_assign_preview: true,
        ui_assign_filter: null,
        ui_addobjects_columns: [
            "name",
            "sourcetype",
            "size",
            "actions"
        ],
        theme:{
            dark: false,
            logo: {
                "dark": "/images/plusmeta.svg",
                "light": "/images/plusmeta_dark.svg"
            },
            themes: {
                "dark": {
                    "primary": "#dec88e",
                    "secondary": "#636363",
                    "accent": "#5755d9",
                    "error": "#FF5252",
                    "info": "#5cc5f2",
                    "success": "#4CAF50",
                    "warning": "#FFC107",
                    "anchor": "#c4c4c4"
                },
                "light": {
                    "primary": "#498fcb",
                    "secondary": "#9c9c9c",
                    "accent": "#5755d9",
                    "error": "#FF5252",
                    "info": "#5cc5f2",
                    "success": "#4CAF50",
                    "warning": "#FFC107",
                    "anchor": "#c4c4c4"
                }
            }
        }
    }
};

// getters
const getters = {
    isReady: (state) => {
        return state.ready;
    },
    isDarkTheme: (state) => {
        return !!state.settings?.theme?.dark;
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
    getLogoForTheme: state => (theme) => {
        return state.settings.theme?.logo[theme] || "dark";
    },
    isOrgaIsNotValidCount: (state, getters) => {
        return [
            getters.getSetting("user_eula"),
            getters.getSetting("base_user_name"),
            getters.getSetting("base_user_mail"),
            getters.getSetting("base_orga_name"),
            getters.getSetting("base_orga_fullname")
        ].map(Boolean).filter(v => v === false).length;
    },
    isProductNotValidCount: (state, getters, rootState, rootGetters) => {
        return [
            (rootGetters["projects/getCurrentProjectRelationById"]("vdi:SerialNumber")?.[0] || rootGetters["projects/getCurrentProjectRelationById"]("vdi:IEC61406")?.[0]),
            rootGetters["projects/getCurrentProjectRelationById"]("vdi:ProductVariant")?.[0],
            rootGetters["projects/getCurrentProjectRelationById"]("vdi:EquipmentId")?.[0]
        ].map(Boolean).filter(v => v === false).length;
    },
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
    async changeLanguageLocal({ commit, getters, dispatch }, locale) {
        await dispatch("help/setLocale", locale, { root: true });
        commit("CHANGE_LANGUAGE", locale);
    },
    setCurrentProjectLocal({ commit, getters, dispatch, rootGetters }, projectUuid) {
        commit("SET_CURRENT_PROJECT", projectUuid);
    },
    resetSettings({ commit, getters, dispatch }, override = false) {
        if (override || !Object.keys(getters.getSettings).length) {
            window.localStorage.removeItem("settings");
            commit("RESET_LOCAL_SETTINGS");
        }
        dispatch("changeLanguageLocal", getters.getCurrentLocale);
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
