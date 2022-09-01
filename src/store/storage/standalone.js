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
    indexById: (state, getters) => {
        return getters._dict.ixById;
    },
    indexByExternalId: (state, getters) => {
        return getters._dict.ixByExId;
    },
    indizesByType: (state, getters) => {
        return getters._dict.ixsByType;
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
    countAllObjects: (state) => {
        return state.objects.length;
    },
    countObjectsByType: getters => (type) => {
        return getters.getObjectsByType(type).length;
    },
    countProjectObjectsByType: (state, getters) => (projectUuid, type) => {
        return getters.getProjectObjectsByType(projectUuid, type).length;
    },
    getObjectByIndex: (state, getters) => (index) => {
        return state.objects[index];
    },
    getObjectById: (state, getters) => (objectId) => {
        return getters.getObjectByIndex(getters.indexById[objectId]);
    },
    getObjectByExternalId: (state, getters) => (externalId) => {
        return getters.getObjectByIndex(getters.indexByExternalId[externalId]);
    },
    getObjectByUuid: (state, getters) => (objectUuid) => {
        return getters.getObjectByIndex(getters.indexByUuid[objectUuid]);
    },
    getObjectType: (state, getters) => (objectUuid) => {
        return getters.getObjectByUuid(objectUuid)?.type;
    },
    getObjectsByType: state => (type) => {
        if (type === undefined) {
            return state.objects;
        } else if (typeof type === "string") {
            return getters.indizesByType[type]?.map(getters.getObjectByIndex).filter(Boolean) || [];
        } else if (Array.isArray(type)) {
            return type.flatMap(typ => getters.indizesByType[typ]?.map(getters.getObjectByIndex)).filter(Boolean) || [];
        } else return [];
    },
    getObjectUuidsByType: (state, getters) => (type) => {
        return getters.getObjectsByType(type).map(object => object.uuid);
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
    getObjectUuidsByProject: (state, getters, rootState, rootGetters) => (projectUuid) => {
        return rootGetters["projects/getObjectUuidsForProject"](projectUuid);
    },
    getObjectsByProject: (state, getters, rootState, rootGetters) => (projectUuid) => {
        return getters.getObjectUuidsByProject(projectUuid).map((uuid) => {
            state.objects[getters.indexByUuid[uuid]];
        });
    },
    getProjectObjectsByType: (state, getters) => (projectUuid, type) => {
        let projectObjects = getters.getObjectsByProject(projectUuid);

        if (type === undefined) {
            return projectObjects;
        } else if (typeof type === "string") {
            return projectObjects.filter(object => object.type === type);
        } else if (Array.isArray(type)) {
            return projectObjects.filter(object => type.includes(object.type));
        } else return [];
    },
    getProjectObjectUuidsByType: (state, getters) => (projectUuid, type) => {
        return getters.getProjectObjectsByType(projectUuid, type).map(object => object.uuid);
    },
    getObjectTypes: (state, getters) => {
        return Object.entries(getters.indizesByType).reduce((obj,[k, v]) => {
            obj[k] = v.length;
            return obj;
        }, {});
    },
    isMetaDataLoading: (state) => {
        return false;
    },
    isObjectLoading: (state) => {
        return false;
    },
    isSourceDataLoading: (state) => {
        return false;
    },
    isBatchLoading: (state) => {
        return false;
    },
    getActiveSourceMbs: (state) => {
        const sizeInByte = state.objects
            .filter(object => !!object?.source?.data)
            .map(object => object.source)
            .reduce((prev, source) => {
                prev += source.size;
                return prev;
            }, 0);

        const sizeInMByte = sizeInByte / (1000 * 1000);
        return sizeInMByte;
    },
    countCurrentObjects: (state, getters, rootState, rootGetters) => {
        return rootGetters["projects/getCurrentObjectUuids"].length;
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
    getCurrentObjectUuidsByType: (state, getters, rootState, rootGetters) => (type) => {
        return getters.getCurrentObjectsByType(type).map(object => object.uuid);
    },
};

// actions
const actions = {
    clearStorage ({ commit }) {
        commit("CLEAR_STORAGE");
    },
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
    saveObjectsLocal({ commit, getters, dispatch, state }, updatedObjects) {
        let objectsToAdd = [];
        for (let updatedObject of updatedObjects) {
            if (getters.getObjectByUuid(updatedObject.uuid)) {
                dispatch("saveObjectLocal", updatedObject);
            }
            else {
                objectsToAdd.push(updatedObject);
            }
        }
        commit("ADD_OBJECTS", objectsToAdd);
    },
    addMetadata({ commit, getters }, {objectUuid, objectMeta}) {
        let objectIndex = getters.indexByUuid[objectUuid];
        if (Number.isInteger(objectIndex)) {
            commit("UPDATE_METADATUM", {objectIndex, objectMeta});
        }
    },
    deleteMetadata({ commit, getters }, {objectUuid, objectMeta}) {
        let objectIndex = getters.indexByUuid[objectUuid];
        if (Number.isInteger(objectIndex)) {
            commit("DELETE_METADATA", {objectIndex, objectMeta});
        }
    },
    deleteObjectData ({ commit, getters }, objectUuid) {
        let objectSource = getters.getObjectByUuid(objectUuid).source;
        commit("DELETE_OBJECT_SOURCE_LOCAL_DATA", objectSource);
    },
    deleteObject({ dispatch }, objectUuid) {
        dispatch("deleteObjects", [objectUuid]);
    },
    deleteObjects({ commit, getters, dispatch }, objectUuids) {
        let objects = objectUuids.map(getters.getObjectByUuid).filter(Boolean);
        commit("DELETE_OBJECTS", objects.map(object => object.uuid).filter(Boolean));
    },
    uploadSource({ getters, commit, rootGetters }, { objectUuid }) {
        return true;
    },
    uploadThumbnail({ getters, commit, rootGetters }, { objectUuid, file }) {
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
    ADD_OBJECTS (state, payload) {
        payload.map((obj) => {
            let object = template.object(obj);
            Array.from(Object.values(object.meta || {})).forEach(m => template.metadata(m));
            return object;
        });
        state.objects.push(...payload);
    },
    CLEAR_STORAGE (state) {
        Vue.set(state, "objects", []);
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
    UPDATE_OBJECT_DATA (state, { source, data }) {
        Vue.set(source, "data", data);
    },
    DELETE_OBJECT_SOURCE_LOCAL_DATA(state, objectSource) {
        objectSource.data = null;
        Vue.delete(objectSource, "data");
    },
    UPDATE_OBJECT_SOURCE_THUMB_URI(state, { source, uri }) {
        Vue.set(source, "thumbnailUri", uri);
    },
    UPDATE_OBJECT_SOURCE_URI (state, { source, uri }) {
        Vue.set(source, "uri", uri);
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
    DELETE_METADATA (state, {objectMeta, objectIndex}) {
        objectMeta = template.metadata(objectMeta);
        let metaObj = state.objects[objectIndex].meta || {};
        Vue.delete(metaObj, objectMeta.uri);
    },
    DELETE_OBJECT (state, payload) {
        state.objects.splice(payload, 1);
    },
    DELETE_OBJECTS (state, payload) {
        state.objects = state.objects.filter(object => !payload.includes(object.uuid));
    },
    RESET_LOCAL_OBJECTS(state) {
        Vue.set(state, "objects", []);
    },
};

export default {
    namespaced: true,
    state,
    getters,
    actions,
    mutations
};
