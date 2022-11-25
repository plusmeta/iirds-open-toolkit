import Vue from "vue";
import config from "@/config";

// initial state
const state = {
    help: {
        dict: {},
        baseUrl: config.helpRoot,
        localePath: "",
        fallback: "workflow.welcome"
    }
};

// getters
const getters = {
    getBaseUrl: (state, getters) => {
        return (state.help.baseUrl || "");
    },
    getLocalePath: (state, getters) => {
        return (state.help.localePath || "");
    },
    getHelp: (state, getters) => (helpkey) => {
        return (state.help.dict || {})[helpkey];
    },
    getHelpSection: (state, getters) => (helpkey) => {
        return (getters.getHelp(helpkey) || {}).section;
    },
    getHelpPage: (state, getters) => (helpkey) => {
        return (getters.getHelp(helpkey) || {}).page;
    },
    getHelpTitle: (state, getters) => (helpkey) => {
        return (getters.getHelp(helpkey) || {}).title;
    },
    getHelpText: (state, getters) => (helpkey) => {
        return (getters.getHelp(helpkey) || {}).text;
    },
    getFallbackKey: (state) => {
        return state.help.fallback;
    },
    getFallbackPage: (state, getters) => {
        const helpKey = getters.getFallbackKey;
        return getters.getHelpPage(helpKey);
    },
    getSlug: (state, getters) => (helpkey) => {
        const section = getters.getHelpSection(helpkey) ?? "";

        return section
            .replace(/\s+/, "-")
            .toLowerCase();
    },
    getHelpLink: (state, getters) => (helpkey) => {
        const url = getters.getBaseUrl;
        const localPath = getters.getLocalePath;
        const page = getters.getHelpPage(helpkey) || getters.getFallbackPage;
        const slug = getters.getSlug(helpkey);
        return `${url}/${localPath}/${page}${slug ? "#" + slug : slug}`;
    }
};

// actions
const actions = {
    async loadDict({ commit, getters, dispatch }, locale) {
        switch (locale) {
        case "de":
            return await import(/* webpackChunkName: "de.help" */ "@/i18n/help/de.json");
        case "en":
            return await import(/* webpackChunkName: "en.help" */ "@/i18n/help/en.json");
        case "zh":
            return await import(/* webpackChunkName: "en.help" */ "@/i18n/help/zh.json");
        default:
            return await import(/* webpackChunkName: "de.help" */ "@/i18n/help/de.json");
        }
    },
    async setLocale({ commit, getters, dispatch }, locale) {
        let dict = await dispatch("loadDict", locale);
        commit("SET_HELP_DICT", dict);
        commit("SET_LOCALE_PATH", locale);
    }
};

// mutations
const mutations = {
    SET_HELP_DICT(state, dict) {
        Vue.set(state.help, "dict", dict);
    },
    SET_LOCALE_PATH(state, path) {
        Vue.set(state.help, "localePath", path);
    }
};

export default {
    namespaced: true,
    state,
    getters,
    actions,
    mutations
};


