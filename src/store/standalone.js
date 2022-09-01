/*!
 * Copyright 2022 plusmeta GmbH
 * License: MIT
 */

import Vue from "vue";
import Vuex from "vuex";
import VuexPersistence from "vuex-persist";

import settings from "@/store/settings/standalone";
import properties from "@/store/properties/standalone";
import projects from "@/store/projects/standalone";
import storage from "@/store/storage/standalone";
import help from "@/store/help";
import workflows from "@/store/workflows";

Vue.use(Vuex);

const vuexLocal = new VuexPersistence({
    key: "settings",
    storage: window.localStorage,
    reducer: (state) => {
        return {
            settings: { settings: state.settings.settings }
        };
    }
});

const store = new Vuex.Store({
    modules: {
        projects,
        storage,
        settings,
        properties,
        workflows,
        help
    },
    plugins: [vuexLocal.plugin]
});

export default store;
