/*!
 * Copyright 2022 plusmeta GmbH
 * License: MIT
 */

import Vue from "vue";
import template from "@/store/storage/template";

// state
const state = {
    objects: [],
    isObjectLoading: false,
    isMetaDataLoading: false
};

// getters
const getters = {
    _dict: (state) => {
        return state.objects.reduce(({ ixByUuid, ixById, ixByExId, ixsByType, typeByUuid }, item, index) => {
            ixByUuid[item.uuid] = index;
            ixById[item.id] = index;
            typeByUuid[item.uuid] = item.type;
            // if object has external Id
            if (item.hasOwnProperty("externalId")) {
                ixByExId[item.externalId] = index;
            }
            // by Types
            if (!ixsByType.hasOwnProperty(item.type)) {
                ixsByType[item.type] = [];
            }
            ixsByType[item.type].push(index);
            return { ixByUuid, ixById, ixByExId, ixsByType, typeByUuid };
        }, { ixByUuid: {}, ixById: {}, ixByExId: {}, ixsByType: {}, typeByUuid: {} });
    },
    typeByUuid: (state, getters) => {
        return getters._dict.typeByUuid;
    },
    indexByUuid: (state, getters) => {
        return getters._dict.ixByUuid;
    },
    indexByExternalId: (state, getters) => {
        return getters._dict.ixByExId;
    },
    indizesCurrentByType: (state, getters) => {
        return getters.getCurrentObjectUuids.reduce((map, uuid) => {
            let type = getters.typeByUuid[uuid];
            if (type) {
                if (!map.hasOwnProperty(type)) {
                    map[type] = [];
                }
                map[type].push(getters.indexByUuid[uuid]);
            }
            return map;
        }, {});
    },
    getObjectByIndex: (state, getters) => (index) => {
        return state.objects[index];
    },
    getObjectByExternalId: (state, getters) => (externalId) => {
        return getters.getObjectByIndex(getters.indexByExternalId[externalId]);
    },
    getObjectByUuid: (state, getters) => (objectUuid) => {
        return getters.getObjectByIndex(getters.indexByUuid[objectUuid]);
    },
    getMetadata: (state, getters) => (objectUuid) => {
        const object = getters.getObjectByUuid(objectUuid);
        return Object.values(object?.meta || {});
    },
    getMetadataByURI: (state, getters) => (objectUuid, metadataURI) => {
        const object = getters.getObjectByUuid(objectUuid);
        return object?.meta[metadataURI];
    },
    getMetadataValueByURI: (state, getters) => (objectUuid, metadataURI) => {
        const metadata = getters.getMetadataByURI(objectUuid, metadataURI);
        if (metadata !== undefined) {
            return metadata.value;
        } else {
            return null;
        }
    },
    getActiveSourceMbs: (state) => {
        const sizeInByte = state.objects
            .filter(object => !!object?.source?.data)
            .map(object => object.source)
            .reduce((prev, source) => {
                prev += source.size;
                return prev;
            }, 0);

        return sizeInByte / (1000 * 1000);
    },
    countCurrentObjectsByType: (state, getters) => (type) => {
        return getters.getCurrentObjectsByType(type).length;
    },
    getCurrentObjectTypes: (state, getters) => {
        return Object.entries(getters.indizesCurrentByType).reduce((obj,[k, v]) => {
            if (k) obj[k] = v.length;
            return obj;
        }, {});
    },
    getCurrentObjectUuids: (state, getters, rootState, rootGetters) => {
        return rootGetters["projects/getCurrentObjectUuids"];
    },
    getCurrentObjects: (state, getters, rootState, rootGetters) => {
        return getters.getCurrentObjectUuids.map(uuid => state.objects[getters.indexByUuid[uuid]]).filter(Boolean);
    },
    getCurrentObjectsByType: (state, getters) => (type) => {
        if (type === undefined) {
            return getters.getCurrentObjects;
        } else if (typeof type === "string") {
            return (getters.indizesCurrentByType[type] || []).map(index => state.objects[index]).filter(Boolean);
        } else if (Array.isArray(type)) {
            return type.flatMap(typ => (getters.indizesCurrentByType[typ] || []).map(index => state.objects[index])).filter(Boolean);
        } else return [];
    },
    getSanitizedMetaValueByURI: (state, getters, rootState, rootGetters) => (objectUuid, uri) => {
        let value = getters.getMetadataValueByURI(objectUuid, uri);
        return Array.isArray(value) ? value[0] : value;
    },
    countInvalidObjects: (state, getters, rootState, rootGetters) => {
        const metaUrisToCheck = rootGetters["properties/getPropertiesByRole"]("plus:AssignableMetadata")
            .filter(m => rootGetters["properties/isRequired"](m.identifier))
            .map(m => rootGetters["properties/resolveAssignedRelationType"](m.identifier));

        return getters.getCurrentObjectsByType("plus:Document").filter((o) => {
            return !metaUrisToCheck.every((uri) => {

                const val = o.meta[uri]?.value;
                if (val === null || val === undefined) {
                    return false;
                } else if (Array.isArray(val)) {
                    return val?.filter(Boolean).length > 0;
                } else if (typeof val === "string"){
                    return val?.length > 0;
                }
                return true;
            });
        })?.length;
    }
};

// actions
const actions = {
    saveObjectLocal({ commit, getters }, updatedObject) {
        const uuid = updatedObject.uuid;
        let existingObject = getters.getObjectByUuid(uuid);

        if (existingObject) {
            if (updatedObject.meta) {
                commit("UPDATE_OBJECT_META", { existingObject, updatedMeta: updatedObject.meta});
            }

            if (updatedObject.source) {
                commit("UPDATE_OBJECT_SOURCE", { oldSource: existingObject.source, updatedSource: updatedObject.source});
            }

            commit("UPDATE_OBJECT", { oldObject: existingObject, updatedObject });
        } else {
            commit("ADD_OBJECT", updatedObject);
        }
    },
    addMetadata({ commit, getters }, {objectUuid, objectMeta}) {
        let objectIndex = getters.indexByUuid[objectUuid];
        if (Number.isInteger(objectIndex)) {
            commit("UPDATE_METADATUM", {objectIndex, objectMeta});
        }
    },
    deleteObject({ dispatch }, objectUuid) {
        dispatch("deleteObjects", [objectUuid]);
    },
    deleteObjects({ commit, getters, dispatch }, objectUuids) {
        let objects = objectUuids.map(getters.getObjectByUuid).filter(Boolean);
        commit("DELETE_OBJECTS", objects.map(object => object.uuid).filter(Boolean));
    },
    uploadThumbnail({}, {}) {
        return true;
    },
    fetchSource({ commit, getters }, objectUuid) {
        const source = getters.getObjectByUuid(objectUuid)?.source;
        if (source && source.data) {
            return source.data;
        } else {
            return false;
        }
    },
    loadObjectByUuid({ commit, dispatch }, objectUuid) {
        return getters.getObjectByUuid(objectUuid);
    },
    saveMetaDatum({ commit, dispatch, getters }, { objectUuid, objectMeta }) {
        dispatch("addMetadata", {objectUuid, objectMeta});
    }
};

// mutations
const mutations = {
    ADD_OBJECT (state, payload) {
        payload = template.object(payload);
        Array.from(Object.values(payload.meta || {})).forEach(m => template.metadata(m));
        state.objects.push(payload);
    },
    UPDATE_OBJECT (state, { oldObject, updatedObject }) {
        delete updatedObject.source;
        delete updatedObject.meta;
        oldObject = Object.assign(oldObject, updatedObject);
    },
    UPDATE_OBJECT_SOURCE (state, { oldSource, updatedSource }) {
        delete updatedSource.data;
        oldSource = Object.assign(oldSource, updatedSource);
    },
    UPDATE_OBJECT_META (state, { metaObject, updatedMeta }) {
        Array.from(Object.values(updatedMeta))
            .forEach(m => template.metadata(m));

        Vue.set(metaObject, "meta", updatedMeta);
    },
    UPDATE_METADATUM (state, payload) {
        let metaObject = state.objects[payload.objectIndex] || {};
        let updatedMeta = payload.objectMeta;
        if (updatedMeta && updatedMeta.uri) {
            updatedMeta = template.metadata(updatedMeta);
            Object.keys(updatedMeta).forEach(key => (updatedMeta[key] === undefined) && delete updatedMeta[key]);
            updatedMeta = Object.assign((metaObject.meta || {})[updatedMeta.uri] || {}, updatedMeta);
            Vue.set(metaObject.meta, updatedMeta.uri, updatedMeta);
        }
    },
    DELETE_OBJECTS (state, payload) {
        state.objects = state.objects.filter(object => !payload.includes(object.uuid));
    }
};

export default {
    namespaced: true,
    state,
    getters,
    actions,
    mutations
};
